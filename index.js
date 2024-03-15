const AsarBundleRunner = require('asar-bundle-runner');
const asar = require('@electron/asar');
const { cpSync } = require('node:fs');
const path = require('node:path');
/**
 * * Freedeck Developer Environment
 * Welcome!
 * - Edit the FDE_Settings object below to configure your environment.
 */

let name = 'HAFreedeck'
let bundleName = name + '.Freedeck'
// let bundleName = 'ExamplePlugin.Freedeck'
const FDE_Settings = {
	UseScripts: true,
	BundlePrebuild: name,
	BundleName: bundleName,
	scripts: [],
	_abr_extract: "",
	_abr_run_output: ""
}

function buildPhase() {
	return new Promise((resolve, reject) => {
		console.log('Building!')
		asar.createPackage(FDE_Settings.BundlePrebuild + ".src",  path.resolve('./plugins/' + FDE_Settings.BundleName)).then(() => {
			cpSync(path.resolve('./plugins',FDE_Settings.BundleName), path.resolve('./build/' + FDE_Settings.BundleName))

			AsarBundleRunner.extract("./plugins/"+FDE_Settings.BundleName).then(bundleName => {
				AsarBundleRunner.run(bundleName).then(output => {
					FDE_Settings._abr_run_output = output
					resolve(true)
				}).catch(reject)

			}).catch(reject)
		}).catch(console.error)
	})
}

buildPhase()