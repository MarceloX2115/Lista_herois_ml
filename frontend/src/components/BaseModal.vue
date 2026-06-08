<template>
  <Teleport to="body">
    <div v-if="modelValue" class="overlay" @click.self="$emit('update:modelValue', false)">
      <div class="modal-box" :class="size === 'sm' ? 'modal-box--sm' : ''">
        <div class="modal-header">
          <h2>{{ title }}</h2>
          <button class="btn-close" @click="$emit('update:modelValue', false)">✕</button>
        </div>
        <slot />
      </div>
    </div>
  </Teleport>
</template>

<script setup>
defineProps({
  modelValue: Boolean,
  title: String,
  size: { type: String, default: 'md' }
})
defineEmits(['update:modelValue'])
</script>

<style scoped>
.overlay {
  position: fixed; inset: 0;
  background: rgba(0,0,0,.65);
  z-index: 200;
  display: flex; align-items: center; justify-content: center;
  padding: 1rem;
}
.modal-box {
  background: var(--surface);
  border: 1px solid var(--border);
  border-radius: 16px;
  width: 100%; max-width: 520px;
  max-height: 90vh; overflow-y: auto;
  box-shadow: var(--shadow);
}
.modal-box--sm { max-width: 400px; }
.modal-header {
  display: flex; align-items: center; justify-content: space-between;
  padding: 1.25rem 1.5rem;
  border-bottom: 1px solid var(--border);
}
.modal-header h2 { font-size: 1.1rem; color: var(--primary); }
.btn-close {
  background: var(--border); border: none; color: var(--text);
  width: 30px; height: 30px; border-radius: 50%; cursor: pointer;
  font-size: .9rem; display: flex; align-items: center; justify-content: center;
}
</style>
