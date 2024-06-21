# STIG- Old

## To run this project: 
1) Ensure you have Node.js and npm installed: https://nodejs.org/en/download/package-manager
2) Clone this Repository
3) cd into this repository
4) cd into STIG-Old
5) Run `npm i`
6) Run `npm start`
7) Open http://localhost:3000/ in a web browser

## Project file structure:
### In use:
- **src**- contains the project's source code.
- **docs**- contains the code for this documentation site: https://stig.readthedocs.io/en/latest/. This is at least partially outdated. Also will we have/need a URL for this repo version (not the public STIG)
- **.eslintignore**, **.eslintrc.js**, **.gitignore**, **package-lock.json**, **package.json**, **tsconfig.json**- standard Git or Node.js files that appear to do their jobs
- **Dockerfile**- needed to run the project (or some part of it) on the catchdev1 server?
- **docker-compose.yaml**- needed for the neo4j database
- **index.ts**- needed for express server setup
- **test_bundle.json**- test STIX data

### Likely not in use/needed in STIG-React:
- **assets/icons**- appears to contain several static image/icon files that are not referenced elesewhere within the codebase.
- **images**- contains three image files which appear to not be used in the codebase and two of the three images are duplicated in the STIG/STIG-Old/docs/source folder.
- **Dockerfile_insecure**- appears to do the job of Dockerfile, but just with some certificate setup

### Further code investigation required:
- **.compilerc**
- **perms.txt**
- **webpack.config.js**

### Not code, but not sure if we need to keep/update:
- **18-179_STIG_Innovation_Sheet.pdf**- at least 5 years old and is an explananatory paper about STIG
- **COPYRIGHT.txt** (6 years old), **LICENSE.txt** (6 years old), and **NOTICE.txt** (updated last on 6/26/23)- legal notices