import type { App } from 'vue';
import {
    // create naive ui
    create,
    // component
    NButton,
    NUpload,
    NDialogProvider,
    NMessageProvider,
    NNotificationProvider,
    NTree,
    NLayout,
    NLayoutSider,
    NLayoutContent,
    NMenu,
    NScrollbar,
    NGrid,
    NGridItem,
    NDivider,
    NDropdown,
    NAnchor,
    NAnchorLink,
    NBackTop,
    NIcon,
    NSpace,
    NModal,
    NCard,
} from 'naive-ui'

const naive = create({
    components: [
        NButton,
        NUpload,
        NDialogProvider,
        NMessageProvider,
        NNotificationProvider,
        NTree,
        NLayout,
        NLayoutSider,
        NLayoutContent,
        NMenu,
        NScrollbar,
        NGrid,
        NGridItem,
        NDivider,
        NDropdown,
        NAnchor,
        NAnchorLink,
        NBackTop,
        NIcon,
        NSpace,
        NModal,
        NCard,
    ]
})


export function setupNaive(app: App<Element>) {
    app.use(naive)
}