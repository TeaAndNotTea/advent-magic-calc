<?php
/**
 * Plugin Name: CCA Wizard Code Generator
 * Description: Generates the Colossal Cave wizard response word. Use [cca_wizard_code].
 * Version:     1.0.0
 * Author:      Geekmaster General
 */

if ( ! defined( 'ABSPATH' ) ) exit;

function cca_wiz_asset_version( $relative_path ) {
    $full_path = plugin_dir_path( __FILE__ ) . ltrim( $relative_path, '/' );
    if ( file_exists( $full_path ) ) {
        $mtime = filemtime( $full_path );
        if ( false !== $mtime ) return (string) $mtime;
    }
    return '1.0.0';
}

function cca_wiz_register_scripts() {
    wp_register_script(
        'cca-wiz-module',
        plugins_url( 'assets/wizard.js', __FILE__ ),
        array(),
        cca_wiz_asset_version( 'assets/wizard.js' ),
        true
    );

    wp_register_script(
        'cca-wiz-play',
        plugins_url( 'assets/play.js', __FILE__ ),
        array( 'cca-wiz-module' ),
        cca_wiz_asset_version( 'assets/play.js' ),
        true
    );

    // Ensure play.js runs as an ES module (so it can import / use module-style patterns if desired).
    wp_script_add_data( 'cca-wiz-play', 'type', 'module' );
}
add_action( 'wp_enqueue_scripts', 'cca_wiz_register_scripts' );

function cca_wiz_enqueue_shortcode_assets( $config = array() ) {
    static $did_enqueue = false;
    if ( $did_enqueue ) return;
    $did_enqueue = true;

    wp_enqueue_script( 'cca-wiz-module' );
    wp_enqueue_script( 'cca-wiz-play' );

    wp_localize_script(
        'cca-wiz-play',
        'CCAWizardCodeConfig',
        array(
            'defaultMagnm' => isset( $config['defaultMagnm'] ) ? (int) $config['defaultMagnm'] : 11111,
        )
    );
}

function cca_wiz_shortcode( $atts = array() ) {
    $atts = shortcode_atts(
        array(
            'magnm' => '11111',
        ),
        $atts,
        'cca_wizard_code'
    );

    $magnm = (int) $atts['magnm'];

    cca_wiz_enqueue_shortcode_assets( array( 'defaultMagnm' => 11111 ) );

    // Per-instance magnm lives on the element.
    $id = 'cca-wiz-' . wp_generate_password( 8, false, false );

    ob_start();
    ?>
    <div id="<?php echo esc_attr( $id ); ?>"
         class="cca-wizard-code"
         data-magnm="<?php echo esc_attr( (string) $magnm ); ?>">
      <label>
        Challenge (5 letters):
        <input type="text" class="cca-challenge" maxlength="5" autocomplete="off" spellcheck="false">
      </label>
      <button type="button" class="cca-generate">Generate response</button>
      <div class="cca-result" style="margin-top:8px;"></div>
      <div style="margin-top:6px; font-size: 0.9em; opacity: 0.8;">
        Uses browser local time (matches in-browser WASM runtime).
      </div>
    </div>
    <?php
    return ob_get_clean();
}
add_shortcode( 'cca_wizard_code', 'cca_wiz_shortcode' );
