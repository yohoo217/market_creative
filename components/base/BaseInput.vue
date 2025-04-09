<template>
  <div class="base-input-wrapper">
    <label v-if="label" :for="id" class="base-input-label">
      {{ label }}
      <span v-if="required" class="required-mark">*</span>
    </label>
    
    <div class="base-input-container" :class="{ 'has-error': hasError }">
      <slot name="prefix"></slot>
      
      <input
        :id="id"
        :type="type"
        :value="modelValue"
        :placeholder="placeholder"
        :disabled="disabled"
        :readonly="readonly"
        :required="required"
        :autocomplete="autocomplete"
        class="base-input"
        @input="updateValue"
        @blur="onBlur"
      />
      
      <slot name="suffix"></slot>
    </div>
    
    <div v-if="hasError" class="base-input-error">
      {{ errorMessage }}
    </div>
    
    <div v-if="description && !hasError" class="base-input-description">
      {{ description }}
    </div>
  </div>
</template>

<script setup lang="ts">
import { defineProps, defineEmits, computed, ref } from 'vue';

const props = defineProps({
  modelValue: {
    type: [String, Number],
    default: ''
  },
  label: {
    type: String,
    default: ''
  },
  type: {
    type: String,
    default: 'text'
  },
  placeholder: {
    type: String,
    default: ''
  },
  disabled: {
    type: Boolean,
    default: false
  },
  readonly: {
    type: Boolean,
    default: false
  },
  required: {
    type: Boolean,
    default: false
  },
  autocomplete: {
    type: String,
    default: 'off'
  },
  id: {
    type: String,
    default: () => `input-${Math.random().toString(36).substring(2, 9)}`
  },
  description: {
    type: String,
    default: ''
  },
  errorMessage: {
    type: String,
    default: ''
  },
  validateOnBlur: {
    type: Boolean,
    default: false
  },
});

const modelValue = defineModel<string | number>('modelValue');
const hasError = computed(() => !!props.errorMessage);
const wasTouched = ref(false);

const updateValue = (event: Event) => {
  const target = event.target as HTMLInputElement;
  modelValue.value = props.type === 'number' 
    ? parseFloat(target.value) 
    : target.value;
};

const onBlur = (event: Event) => {
  wasTouched.value = true;
  emit('blur', event);
};

const emit = defineEmits(['blur']);
</script>

<style scoped>
.base-input-wrapper {
  @apply flex flex-col mb-4;
}

.base-input-label {
  @apply block text-sm font-medium text-gray-700 mb-1;
}

.required-mark {
  @apply text-red-500 ml-1;
}

.base-input-container {
  @apply flex items-center w-full relative border border-gray-300 rounded-md shadow-sm;
  transition: all 0.2s ease;
}

.base-input-container:focus-within {
  @apply border-primary-500 ring-1 ring-primary-500;
}

.base-input-container.has-error {
  @apply border-red-500 ring-1 ring-red-500;
}

.base-input {
  @apply py-2 px-3 w-full rounded-md text-gray-900 placeholder-gray-400 focus:outline-none;
}

.base-input:disabled {
  @apply bg-gray-100 text-gray-500 cursor-not-allowed;
}

.base-input-error {
  @apply mt-1 text-sm text-red-600;
}

.base-input-description {
  @apply mt-1 text-sm text-gray-500;
}
</style> 