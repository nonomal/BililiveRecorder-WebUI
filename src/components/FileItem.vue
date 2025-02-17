<script lang="ts">
import { useRouter, useRoute } from 'vue-router';
import { FileDto, FolderDto } from '../utils/api';
import { byteToHuman } from '../utils/unitConvert';
import { NIcon, NButton, NTime, useThemeVars } from 'naive-ui';
import { File, FileVideo, Folder } from '@vicons/fa';
import { recorderController } from '../utils/RecorderController';
</script>
<script setup lang="ts">
const theme = useThemeVars();
const route = useRoute();
const router = useRouter();
const props = defineProps({
  file: {
    type: Object as () => FileDto | FolderDto,
    required: true,
  },
  currentPath: {
    type: String,
    default: '/',
  },
});

function calcFilePath(url: string) {
  return new URL(url, recorderController.recorder?.meta.path).toString();
}

function onClick(e: MouseEvent) {
  if (props.file.isFolder) {
    e.preventDefault();
    e.stopPropagation();
    router.push({ hash: '#' + props.currentPath + props.file.name });
    return;
  }
}

function goVideoPreview(e: MouseEvent) {
  e.preventDefault();
  e.stopPropagation();
  router.push({ path: `/recorder/${route.params.id}/player`, hash: '#' + props.currentPath + props.file.name });
  return;
}

</script>
<template>
  <a class="item" :href="file.isFolder ? ('#' + props.currentPath + file.name) : calcFilePath(file.url)" :style="{
    '--text-color': theme.textColor1,
    '--hover-color': theme.hoverColor,
    '--pressed-color': theme.pressedColor,
    '--border-radius': theme.borderRadius,
    '--background-color': theme.cardColor,
  }" @click="onClick">
    <div class="item-left">
      <n-button v-if="file.name.endsWith('.flv')" quaternary tiny style="padding:0;line-height:14px;height:unset"
        @click="goVideoPreview">
        <n-icon size="14">
          <file-video />
        </n-icon>
      </n-button>
      <n-icon v-else size="14">
        <folder v-if="file.isFolder" />
        <file-video v-else-if="file.name.endsWith('.flv')" />
        <file v-else />
      </n-icon>
      <span>{{ file.name }}</span>
      <span v-if="!file.isFolder">{{ byteToHuman(file.size) }}</span>
    </div>
    <n-time :time="new Date(file.lastModified)"
      :type="(Date.now() - new Date(file.lastModified).valueOf() > 2678400000) ? 'datetime' : 'relative'"></n-time>
  </a>
</template>
<style lang="scss" scoped>
.item {
  color: var(--text-color);
  text-decoration: none;
  padding: 2px 16px;
  border-radius: var(--border-radius);
  background-color: var(--background-color);
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  font-size: 13px;

  .item-left {
    display: flex;
    flex-direction: row;
    align-items: center;
    gap: 8px;
  }

  &:hover {
    background-color: var(--hover-color);
  }

  &:active {
    background-color: var(--pressed-color);
  }
}
</style>
