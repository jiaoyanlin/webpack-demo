import Vue from 'vue';
import {
    Button,
    Icon,
    Layout,
    Breadcrumb,
    Dropdown,
    Menu,
    Pagination,
    Steps,
    Checkbox,
    DatePicker,
    Input,
    InputNumber,
    Radio,
    Select,
    Switch,
    TimePicker,
    Popover,
    Tabs,
    Tag,
    Tooltip,
    Alert,
    message,
    Modal,
    Popconfirm,
    Spin,
    ConfigProvider,
    LocaleProvider
} from 'ant-design-vue';

Vue.use(Button);
Vue.use(Icon);
Vue.use(Layout);
Vue.use(Breadcrumb);
Vue.use(Dropdown);
Vue.use(Menu);
Vue.use(Pagination);
Vue.use(Steps);
Vue.use(Checkbox);
Vue.use(DatePicker);
Vue.use(Input);
Vue.use(InputNumber);
Vue.use(Radio);
Vue.use(Select);
Vue.use(Switch);
Vue.use(TimePicker);
Vue.use(Popover);
Vue.use(Tabs);
Vue.use(Tag);
Vue.use(Tooltip);
Vue.use(Alert);
Vue.use(Modal);
Vue.use(Popconfirm);
Vue.use(Spin);
Vue.use(ConfigProvider);
Vue.use(LocaleProvider);
Vue.prototype.$message = message;
Vue.prototype.$Modal = Modal;
