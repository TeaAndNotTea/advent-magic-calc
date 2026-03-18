# Colossal Cave Adventure Magic Mode Unlock Calculator
This project is a simple wordpress plugin to provide calculator to unlock wizard mode, just for the sake of discussion. It has little practical use.

## Blog link
To read more in detail and play the game [check out the blog entry](https://teaandnottea.com/2026/03/18/making-of-colossal-cave-adventure-web-assembly-and-graphics/). There is also a [fixed page with just the game](https://teaandnottea.com/colossal-cave-adventure/) and a few hints and a map.

## Related Repositories
[colossal-cave-adventure on WASM with graphics](https://github.com/TeaAndNotTea/colossal-cave-adventure)


## Overview
The F2C and image generation are completed. This repository takes the resulting C code, cross compiles to WebAssembly(WASM) which is loaded with a JavaScript wrapper. Additional code handles user interface and graphics. Once issue may be using the provided WASM version of a cut-down libf2c. If this causes an issue, contact me and I will expand the repository to add this part of the flow.

## Platform
Tested only on Fedora Linux Workstation. Other Linux distros should work. It should also work on MacOS and Windows/WSL but that has not been tested.

## Build
Requirements:
nothing special

Build command:
just zip the cca-wizard-code directory and upload to wordpress

## Development
cca-wizard-code/cca-wizard-code.php<br>
cca-wizard-code/assets/play.js<br>
cca-wizard-code/assets/wizard.js<br>

## License and Provenance
MIT. Do what you want with it.

All original work in this repository—including but not limited to:

- JavaScript runtime and interface code
- WordPress plugin wrapper and UI
- Tooling, scripts, and enhancements

is licensed under the MIT License (see LICENSE file).

### Intent
This project is intended to preserve, modernize, and make accessible a historically significant piece of interactive computing.

The licensing is deliberately permissive to encourage reuse, experimentation, and further adaptation.