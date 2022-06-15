/*
 * @Author duxuyang
 * @Date 2022-06-15 10:15:30
 * @LastEditors duxuyang
 * @LastEditTime 2022-06-15 10:46:11
 */

// react hooks 页面模板
const reactTem = `
import Taro from '@tarojs/taro';
import React, { useEffect, useState } from 'react';
import { View, Text } from '@tarojs/components';
import classNames from 'classnames/bind';

import styles from './index.module.scss';

const cx = classNames.bind(styles);

const Index = () => {

  useEffect(() => {

  }, []);

  return (
    <View>

    </View>
  );
};

export default Index;
`;

// vue3 模板
const vue3Tem = `
<template>
  <view>

  </view>
</template>

<script setup lang="ts">
import { ref, onMounted, } from 'vue';
const count = ref(0);

onMounted(() => {

});

</script>

<style>

</style>
`

// vue2模板
const vue2Tem = `
<template>
  <view>

  </view>
</template>

<script>
export default {
  data() {
    return {
      number: 0
    }
  },
  methods: {

  }
}
</script>

<style>

</style>
`

// 配置模板内容
const configTem = `
export default {
  navigationBarTitleText: '',
};
`

module.exports = {
  reactTem,
  configTem,
  vue3Tem,
  vue2Tem
}
