<script setup lang="ts">
import { ref, reactive, computed } from 'vue';

interface FormData {
  name: string;
  email: string;
  subject: string;
  message: string;
}

interface FormErrors {
  name: string;
  email: string;
  subject: string;
  message: string;
}

interface TouchedFields {
  name: boolean;
  email: boolean;
  subject: boolean;
  message: boolean;
}

const formData = reactive<FormData>({
  name: '',
  email: '',
  subject: '',
  message: ''
});

const errors = reactive<FormErrors>({
  name: '',
  email: '',
  subject: '',
  message: ''
});

const touched = reactive<TouchedFields>({
  name: false,
  email: false,
  subject: false,
  message: false
});

const isSubmitting = ref(false);
const submitSuccess = ref(false);
const submitError = ref('');

const validateName = (value: string): string => {
  if (!value.trim()) {
    return 'Name is required';
  }
  if (value.trim().length < 2) {
    return 'Name must be at least 2 characters';
  }
  if (value.trim().length > 50) {
    return 'Name must be less than 50 characters';
  }
  return '';
};

const validateEmail = (value: string): string => {
  if (!value.trim()) {
    return 'Email is required';
  }
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(value)) {
    return 'Please enter a valid email address';
  }
  return '';
};

const validateSubject = (value: string): string => {
  if (!value.trim()) {
    return 'Subject is required';
  }
  if (value.trim().length < 3) {
    return 'Subject must be at least 3 characters';
  }
  if (value.trim().length > 100) {
    return 'Subject must be less than 100 characters';
  }
  return '';
};

const validateMessage = (value: string): string => {
  if (!value.trim()) {
    return 'Message is required';
  }
  if (value.trim().length < 10) {
    return 'Message must be at least 10 characters';
  }
  if (value.trim().length > 1000) {
    return 'Message must be less than 1000 characters';
  }
  return '';
};

const handleInput = (field: keyof FormData) => {
  touched[field] = true;
  
  switch (field) {
    case 'name':
      errors.name = validateName(formData.name);
      break;
    case 'email':
      errors.email = validateEmail(formData.email);
      break;
    case 'subject':
      errors.subject = validateSubject(formData.subject);
      break;
    case 'message':
      errors.message = validateMessage(formData.message);
      break;
  }
};

const handleBlur = (field: keyof FormData) => {
  touched[field] = true;
  handleInput(field);
};

const isFormValid = computed(() => {
  return (
    !errors.name &&
    !errors.email &&
    !errors.subject &&
    !errors.message &&
    formData.name.trim() &&
    formData.email.trim() &&
    formData.subject.trim() &&
    formData.message.trim()
  );
});

const handleSubmit = async (e: Event) => {
  e.preventDefault();
  
  touched.name = true;
  touched.email = true;
  touched.subject = true;
  touched.message = true;
  
  errors.name = validateName(formData.name);
  errors.email = validateEmail(formData.email);
  errors.subject = validateSubject(formData.subject);
  errors.message = validateMessage(formData.message);
  
  if (!isFormValid.value) {
    return;
  }
  
  isSubmitting.value = true;
  submitError.value = '';
  submitSuccess.value = false;
  
  try {
    const response = await fetch('https://api.web3forms.com/submit', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        access_key: '38df5ea4-df29-46bb-b6f2-bbb3415ea1ec',
        name: formData.name,
        email: formData.email,
        subject: formData.subject,
        message: formData.message,
      }),
    });
    
    const result = await response.json();
    
    if (!response.ok || !result.success) {
      throw new Error(result.message || 'Failed to send message');
    }
    
    submitSuccess.value = true;
    
    formData.name = '';
    formData.email = '';
    formData.subject = '';
    formData.message = '';
    
    touched.name = false;
    touched.email = false;
    touched.subject = false;
    touched.message = false;
    
    setTimeout(() => {
      submitSuccess.value = false;
    }, 5000);
    
  } catch (error) {
    submitError.value = 'Failed to send message. Please try again.';
  } finally {
    isSubmitting.value = false;
  }
};

const fieldInvalid = (field: keyof FormData) => touched[field] && !!errors[field];

const getInputClasses = (field: keyof FormData) => {
  const base =
    'block w-full rounded-control border bg-surface px-4 text-ink placeholder:text-quiet/70 transition-[border-color,box-shadow] focus:outline-none focus:ring-4';
  return fieldInvalid(field)
    ? `${base} border-error focus:border-error focus:ring-error/15`
    : `${base} border-line-strong focus:border-evergreen focus:ring-evergreen/15`;
};

const fields = [
  { key: 'name', label: 'Name', type: 'text', autocomplete: 'name', placeholder: 'Juan Dela Cruz' },
  { key: 'email', label: 'Email', type: 'email', autocomplete: 'email', placeholder: 'you@example.com' },
] as const;
</script>

<template>
  <div>
    <div
      v-if="submitSuccess"
      role="status"
      class="mb-6 flex gap-3 rounded-control bg-evergreen-soft px-4 py-3 text-evergreen"
    >
      <svg class="mt-0.5 size-5 shrink-0 fill-none stroke-current stroke-2" viewBox="0 0 24 24" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
        <path d="M20 6 9 17l-5-5" />
      </svg>
      <p class="font-semibold">Message sent. I'll get back to you soon.</p>
    </div>

    <div v-if="submitError" role="alert" class="mb-6 rounded-control bg-error-soft px-4 py-3 font-semibold text-error">
      {{ submitError }}
    </div>

    <form novalidate class="space-y-5" @submit="handleSubmit">
      <div class="grid gap-5 sm:grid-cols-2">
        <div v-for="field in fields" :key="field.key">
          <label :for="`contact-${field.key}`" class="block font-semibold">{{ field.label }}</label>
          <input
            :id="`contact-${field.key}`"
            v-model="formData[field.key]"
            :type="field.type"
            :autocomplete="field.autocomplete"
            :placeholder="field.placeholder"
            :aria-invalid="fieldInvalid(field.key)"
            :aria-describedby="fieldInvalid(field.key) ? `contact-${field.key}-error` : undefined"
            :class="[getInputClasses(field.key), 'mt-2 min-h-12']"
            @input="handleInput(field.key)"
            @blur="handleBlur(field.key)"
          />
          <p v-if="fieldInvalid(field.key)" :id="`contact-${field.key}-error`" class="mt-1.5 text-sm font-semibold text-error">
            {{ errors[field.key] }}
          </p>
        </div>
      </div>

      <div>
        <label for="contact-subject" class="block font-semibold">Subject</label>
        <input
          id="contact-subject"
          v-model="formData.subject"
          type="text"
          placeholder="Internship, freelance project, collab…"
          :aria-invalid="fieldInvalid('subject')"
          :aria-describedby="fieldInvalid('subject') ? 'contact-subject-error' : undefined"
          :class="[getInputClasses('subject'), 'mt-2 min-h-12']"
          @input="handleInput('subject')"
          @blur="handleBlur('subject')"
        />
        <p v-if="fieldInvalid('subject')" id="contact-subject-error" class="mt-1.5 text-sm font-semibold text-error">
          {{ errors.subject }}
        </p>
      </div>

      <div>
        <label for="contact-message" class="block font-semibold">Message</label>
        <textarea
          id="contact-message"
          v-model="formData.message"
          rows="5"
          placeholder="Tell me a bit about what you have in mind."
          :aria-invalid="fieldInvalid('message')"
          :aria-describedby="fieldInvalid('message') ? 'contact-message-error' : undefined"
          :class="[getInputClasses('message'), 'mt-2 resize-y py-3 leading-relaxed']"
          @input="handleInput('message')"
          @blur="handleBlur('message')"
        ></textarea>
        <p v-if="fieldInvalid('message')" id="contact-message-error" class="mt-1.5 text-sm font-semibold text-error">
          {{ errors.message }}
        </p>
      </div>

      <button
        type="submit"
        :disabled="isSubmitting"
        class="group inline-flex min-h-13 w-full items-center justify-center gap-2 rounded-control bg-evergreen px-7 text-lg font-semibold text-on-evergreen shadow-[0_10px_24px_-10px_rgb(30_91_68/0.7)] transition-colors hover:bg-evergreen-hover disabled:cursor-wait disabled:opacity-70"
      >
        <template v-if="!isSubmitting">
          Send message
          <svg class="size-5 fill-none stroke-current stroke-2 transition-transform group-hover:translate-x-0.5" viewBox="0 0 24 24" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
            <path d="M5 12h14M13 6l6 6-6 6" />
          </svg>
        </template>
        <template v-else>
          <svg class="size-5 animate-spin fill-none stroke-current stroke-2" viewBox="0 0 24 24" aria-hidden="true">
            <path d="M21 12a9 9 0 1 1-6.2-8.6" stroke-linecap="round" />
          </svg>
          Sending…
        </template>
      </button>
    </form>
  </div>
</template>
