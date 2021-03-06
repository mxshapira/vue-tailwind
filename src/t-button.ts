import _Vue, { PluginFunction, VueConstructor } from 'vue';
import { extractPropsFromComponentSettings } from './utils/extractPropsFromSettings';
import component from './inputs/TButton';
import ComponentSettings from './types/ComponentSettings';
import CustomProps from './types/CustomProps';

const componentName = 'TButton';


// Define typescript interfaces for autoinstaller
// eslint-disable-next-line @typescript-eslint/no-explicit-any
interface InstallFunction extends PluginFunction<any> {
  installed?: boolean;
}
interface InstallableComponent extends VueConstructor<_Vue> {
  install: InstallFunction;
}

// install function executed by Vue.use()
// eslint-disable-next-line max-len
const install: InstallFunction = function installComponent(Vue: typeof _Vue, args: ComponentSettings = {}) {
  if (install.installed) return;
  install.installed = true;

  const customProps: CustomProps = extractPropsFromComponentSettings(args, component);
  if (customProps) {
    const componentWithCustomVariants = component.extend({
      props: customProps,
    });

    Vue.component(componentName, componentWithCustomVariants);
  } else {
    Vue.component(componentName, component);
  }
};

// Create module definition for Vue.use()
const plugin = {
  install,
};

// To auto-install on non-es builds, when vue is found
// eslint-disable-next-line no-redeclare
/* global window, global */
if (process.env.ES_BUILD === 'false') {
  let GlobalVue = null;
  if (typeof window !== 'undefined') {
    GlobalVue = window.Vue;
  } else if (typeof global !== 'undefined') {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    GlobalVue = (global as any).Vue;
  }
  if (GlobalVue) {
    (GlobalVue as typeof _Vue).use(plugin);
  }
}

// Inject install function into component - allows component
// to be registered via Vue.use() as well as Vue.component()
// eslint-disable-next-line @typescript-eslint/no-explicit-any
(component as any as InstallableComponent).install = install;

// Export component by default
export default component;
