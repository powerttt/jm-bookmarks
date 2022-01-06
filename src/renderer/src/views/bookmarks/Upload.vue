<template>
  <h5># 导入</h5>

  <n-space>
    <n-upload @change="handleChange" :default-upload="false" ref="upload">
      <n-button secondary strong>
        <template #icon>
          <n-icon>
            <CloudUploadOutline />
          </n-icon>
        </template>
        选择文件
      </n-button>
    </n-upload>
    <n-button
      strong
      secondary
      type="info"
      :loading="btnLoading.uploadLoading"
      @click="uploadSubmit"
    >
      <template #icon>
        <n-icon>
          <PlayOutline />
        </n-icon> </template
      >确认上传文件
    </n-button>
  </n-space>

  <h5># 导出</h5>

  <n-space>
    <n-button
      strong
      secondary
      type="success"
      :loading="btnLoading.exportLoading"
      @click="exportBookmarks"
    >
      <template #icon>
        <n-icon>
          <CloudDownloadOutline />
        </n-icon>
      </template>
      导出书签
    </n-button>
  </n-space>

  <h5># 清空</h5>

  <n-space>
    <n-popconfirm
      positive-text="别管我，直接清空"
      negative-text="点错了"
      :loading="btnLoading.clearLoading"
      @positive-click="clearBookmarksDb"
    >
      <template #trigger>
        <n-button strong secondary type="error">
          <template #icon>
            <n-icon>
              <DeleteDismiss24Filled />
            </n-icon> </template
          >清空本地书签数据
        </n-button>
      </template>
      删除真的好吗？不过你也可以从云上同步下来
    </n-popconfirm>
  </n-space>
</template>

<script lang="ts" setup>
  import { ref, getCurrentInstance, h } from 'vue';
  import { readBookmarks, bookmarksIsDir, exportBookmarksHtml } from '../../utils';
  import type { JmDatastore, BookMarksItem } from '../../types';
  import { useBookmarksStore } from '../../store/modules';
  import { useMessage, useNotification, NIcon } from 'naive-ui';
  import { CloudUploadOutline, CloudDownloadOutline, PlayOutline } from '@vicons/ionicons5';
  import { DeleteDismiss24Filled } from '@vicons/fluent';

  const bookmarksStore = useBookmarksStore();

  const btnLoading = ref({
    uploadLoading: false,
    exportLoading: false,
    clearLoading: false,
  });
  const uploadFile: any = ref({});
  const { proxy } = getCurrentInstance();
  const db: JmDatastore = proxy.$db;
  const message = useMessage();
  const notification = useNotification();

  const handleChange = ({ file }) => {
    if (file) {
      uploadFile.value = file.file;
    }
  };
  const uploadSubmit = () => {
    let path = uploadFile.value.path;
    console.log('file', uploadFile.value);

    if (!path || path == '') {
      message.warning('文件路径为空');
      return;
    }

    btnLoading.value.uploadLoading = true;

    console.log('path', path);
    if (path) {
      readBookmarks(path, (errMsg, result: []) => {
        if (result.length === 0) {
          btnLoading.value.uploadLoading = false;
          message.error('数据为空，请检查导入的文件格式');
          return;
        }
        console.log(result);
        // 写入数据库
        db.bookmarks.insert(result, (err: any, resultDoc: any) => {
          btnLoading.value.uploadLoading = false;

          if (err) {
            message.error('写入失败');
            return;
          }
          message.success('导入成功');
          // 重新加载数据
          bookmarksStore.setArray2Tree(result, true);
        });
      });
    }
  };
  /**
   * 导出书签
   */
  const exportBookmarks = () => {
    btnLoading.value.exportLoading = true;

    let bookmarks = bookmarksStore.getBookmarksTree;
    let str = `
        <!DOCTYPE NETSCAPE-Bookmark-file-1>
        <!-- This is an automatically generated file.It will be read and overwritten.DO NOT EDIT! -->
        <META HTTP-EQUIV="Content-Type" CONTENT="text/html; charset=UTF-8">
        <TITLE>Bookmarks</TITLE>
        <H1>Bookmarks</H1>
        <DL>
            <p>
    `;
    let loop = (root: BookMarksItem[]) => {
      let str = '';
      root.forEach((item: BookMarksItem) => {
        if (bookmarksIsDir(item)) {
          str += `
                    <DT>
                        <H3 ${item.toolbar ? `PERSONAL_TOOLBAR_FOLDER="true"` : ''}>${
            item.name
          }</H3>
                        <DL>
                            <p>
                `;
          if (item.children) {
            str += loop(item.children);
          }

          str += `
                    </DL>
                    <p>
                `;
        } else {
          str += `
                    <DT><A HREF="${item.url}">${item.name}</A>
                `;
        }
      });
      return str;
    };
    str += loop(bookmarks);
    str += `
        </DL>
        <p>
    `;

    let newTime = new Date().getTime();
    let filename = `bookmarks_${newTime}.html`;
    exportBookmarksHtml(filename, str, (err) => {
      let notificationMessage = '导出成功，导出的文件悄悄放在了下载目录';

      if (err && err !== '') {
        notificationMessage = `导出失败，${err}`;
      }
      const n = notification.create({
        title: '书签导出',
        content: `导出成功，导出的文件悄悄放在了下载目录`,
        duration: 10000,
        avatar: () => h(NIcon, {}, { default: () => h(CloudDownloadOutline) }),
      });
      btnLoading.value.exportLoading = false;
    });

    return str;
  };
  const clearBookmarksDb = () => {
    btnLoading.value.clearLoading = true;

    db.bookmarks.remove({}, { multi: true }, (err, msg) => {
      console.log('err', err);
      console.log('message', message);
      message.success('清空成功');
      btnLoading.value.clearLoading = false;

      // 重新加载数据 emits
      bookmarksStore.setArray2Tree([]);
    });
  };
</script>
