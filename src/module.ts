import { defineNuxtModule, addComponent, createResolver, addVitePlugin } from '@nuxt/kit'
import svgLoader from 'vite-svg-loader'
import { Config } from 'svgo'
import { pascalCase } from 'scule'
import { sync as glob } from 'fast-glob'

export interface ModuleOptions {
  prefix: string
  dirs: string[]
  exclude: string[]
  caseSensitive: false
  svgo?: boolean
  svgoConfig?: Config
}

export default defineNuxtModule<ModuleOptions>({
  meta: {
    name: 'nuxt-svg',
    configKey: 'svg'
  },
  defaults: {
    prefix: 'Svg',
    dirs: ['assets/**/**.svg'],
    exclude: [],
    caseSensitive: false,
    svgo: true,
    svgoConfig: {}
  },
  setup  (options, nuxt) {
    const { resolve } = createResolver(nuxt.options.rootDir)

    addVitePlugin(svgLoader(options))

    const fullDirs = options.dirs.map(dir => resolve(dir))
    const exculdeDirs = options.exclude.map(dir => resolve(dir))

    const svgImports = glob(fullDirs, { ignore: exculdeDirs, caseSensitiveMatch: options.caseSensitive })

    svgImports.forEach((filePath) => {
      const name = pascalCase(filePath.substring(0, filePath.lastIndexOf('.')).replace(/^.*[\\/]/, ''))
      addComponent({ name: options.prefix + name, filePath })
    })
  }
})
