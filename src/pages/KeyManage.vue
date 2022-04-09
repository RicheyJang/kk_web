<template>
  <base-container>
    <template #left>
      <instance-select></instance-select>
    </template>
  </base-container>
</template>

<script setup>
import BaseContainer from '../components/common/BaseContainer.vue'
import InstanceSelect from '../components/instance/InstanceSelect.vue';
</script>