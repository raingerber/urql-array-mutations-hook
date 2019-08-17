import readPkg from 'read-pkg'
import copy from 'rollup-plugin-copy'
import generatePackageJson from 'rollup-plugin-generate-package-json'
import filesize from 'rollup-plugin-filesize'

export default {
  input: 'src/index.js',
  output: [
    {
      file: 'dist/index.es.js',
      format: 'esm',
      sourcemap: false
    },
    {
      file: 'dist/index.js',
      format: 'cjs',
      sourcemap: false
    }
  ],
  external: ['urql', 'react'],
  plugins: [
    copy({
      targets: [
        {
          src: 'LICENSE',
          dest: 'dist'
        },
        {
          src: 'README.md',
          dest: 'dist'
        }
      ],
      verbose: true
    }),
    generatePackageJson({
      baseContents: (() => {
        const pkg = readPkg.sync({normalize: false})
        delete pkg.devDependencies
        delete pkg.jest
        pkg.scripts = {}
        return pkg
      })()
    }),
    filesize()
  ]
}
