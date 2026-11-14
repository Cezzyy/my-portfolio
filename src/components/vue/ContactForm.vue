<script setup lang="ts">
import { ref, reactive, computed } from 'vue';

type FieldKey = 'name' | 'email' | 'subject' | 'message';

interface FieldConfig {
  key: FieldKey;
  index: string;
  label: string;
  type: 'text' | 'email' | 'textarea';
  placeholder: string;
  autocomplete?: string;
  max: number;
  wide?: boolean;
}

const fields: FieldConfig[] = [
  { key: 'name', index: '01', label: 'Your name', type: 'text', autocomplete: 'name', placeholder: 'Juan Dela Cruz', max: 50 },
  { key: 'email', index: '02', label: 'Email address', type: 'email', autocomplete: 'email', placeholder: 'you@example.com', max: 254 },
  { key: 'subject', index: '03', label: 'Subject', type: 'text', placeholder: 'What is this about?', max: 100, wide: true },
  { key: 'message', index: '04', label: 'Message', type: 'textarea', placeholder: 'Tell me a bit about what you have in mind.', max: 1000, wide: true },
];

const topics = ['Internship', 'Freelance project', 'Collaboration', 'Just saying hi'];

const MESSAGE_MIN = 10;

const emptyRecord = <T,>(value: T) => ({ name: value, email: value, subject: value, message: value });

const formData = reactive<Record<FieldKey, string>>(emptyRecord(''));
const errors = reactive<Record<FieldKey, string>>(emptyRecord(''));
const touched = reactive<Record<FieldKey, boolean>>(emptyRecord(false));

const isSubmitting = ref(false);
const submitSuccess = ref(false);
const submitError = ref('');
const sentTo = ref('');
const botcheck = ref(false);

const lengthRule = (label: string, value: string, min: number, max: number) => {
  const length = value.trim().length;
  if (!length) return `${label} is required`;
  if (length < min) return `${label} must be at least ${min} characters`;
  if (length > max) return `${label} must be less than ${max} characters`;
  return '';
};

const validators: Record<FieldKey, (value: string) => string> = {
  name: (v) => lengthRule('Name', v, 2, 50),
  email: (v) => {
    if (!v.trim()) return 'Email is required';
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.trim()) ? '' : 'Please enter a valid email address';
  },
  subject: (v) => lengthRule('Subject', v, 3, 100),
  message: (v) => lengthRule('Message', v, MESSAGE_MIN, 1000),
};

const validate = (field: FieldKey) => {
  errors[field] = validators[field](formData[field]);
};

// Errors only appear once a field has been left, so nobody is scolded mid-word.
const handleInput = (field: FieldKey) => {
  if (touched[field]) validate(field);
};

const handleBlur = (field: FieldKey) => {
  if (!formData[field] && !touched[field]) return;
  touched[field] = true;
  validate(field);
};

const fieldInvalid = (field: FieldKey) => touched[field] && !!errors[field];
const fieldValid = (field: FieldKey) => touched[field] && !errors[field] && !!formData[field].trim();

const pickTopic = (topic: string) => {
  formData.subject = topic;
  touched.subject = true;
  validate('subject');
};

const messageLength = computed(() => formData.message.trim().length);
const messageProgress = computed(() => Math.min(messageLength.value / 1000, 1));

const fieldKeys = fields.map((f) => f.key);

const handleSubmit = async () => {
  fieldKeys.forEach((key) => {
    touched[key] = true;
    validate(key);
  });

  const firstInvalid = fieldKeys.find((key) => errors[key]);
  if (firstInvalid) {
    document.getElementById(`contact-${firstInvalid}`)?.focus();
    return;
  }

  isSubmitting.value = true;
  submitError.value = '';

  try {
    const response = await fetch('https://api.web3forms.com/submit', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
      body: JSON.stringify({
        access_key: '38df5ea4-df29-46bb-b6f2-bbb3415ea1ec',
        name: formData.name.trim(),
        email: formData.email.trim(),
        subject: formData.subject.trim(),
        message: formData.message.trim(),
        botcheck: botcheck.value,
      }),
    });

    const result = await response.json();
    if (!response.ok || !result.success) {
      throw new Error(result.message || 'Failed to send message');
    }

    sentTo.value = formData.name.trim().split(/\s+/)[0] ?? '';
    submitSuccess.value = true;
    fieldKeys.forEach((key) => {
      formData[key] = '';
      errors[key] = '';
      touched[key] = false;
    });
  } catch {
    submitError.value = "Something went wrong and your message wasn't sent. Please try again, or email me directly.";
  } finally {
    isSubmitting.value = false;
  }
};

const sendAnother = () => {
  submitSuccess.value = false;
  requestAnimationFrame(() => document.getElementById('contact-name')?.focus());
};

const describedBy = (field: FieldKey) =>
  [fieldInvalid(field) && `contact-${field}-error`, field === 'message' && 'contact-message-count']
    .filter(Boolean)
    .join(' ') || undefined;
</script>

<template>
  <div class="relative">
    <Transition
      mode="out-in"
      enter-active-class="motion-safe:transition motion-safe:duration-500 motion-safe:ease-glide"
      enter-from-class="opacity-0 motion-safe:translate-y-3"
      leave-active-class="motion-safe:transition motion-safe:duration-200"
      leave-to-class="opacity-0"
    >
      <!-- Sent -->
      <div v-if="submitSuccess" key="sent" role="status" class="flex flex-col items-start py-6">
        <span class="relative grid size-16 place-items-center rounded-full bg-evergreen text-on-evergreen">
          <span class="absolute inset-0 rounded-full bg-evergreen/30 motion-safe:animate-ping" aria-hidden="true"></span>
          <svg class="relative size-8 fill-none stroke-current stroke-[2.5]" viewBox="0 0 24 24" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
            <path d="M20 6 9 17l-5-5" />
          </svg>
        </span>
        <h4 class="mt-6 font-display text-3xl font-bold tracking-[-0.02em]">
          Message sent<template v-if="sentTo">, thanks {{ sentTo }}</template>.
        </h4>
        <p class="mt-3 max-w-sm leading-relaxed text-quiet">
          It landed in my inbox. I'll read it properly and get back to you within a couple of days.
        </p>
        <button
          type="button"
          class="mt-8 inline-flex min-h-12 items-center gap-2 rounded-full border border-line-strong/60 px-6 font-semibold text-ink transition-colors hover:border-evergreen hover:text-evergreen"
          @click="sendAnother"
        >
          <svg class="size-4 fill-none stroke-current stroke-2" viewBox="0 0 24 24" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
            <path d="M3 12a9 9 0 1 0 3-6.7L3 8" /><path d="M3 3v5h5" />
          </svg>
          Send another message
        </button>
      </div>

      <!-- Form -->
      <form v-else key="form" novalidate class="grid gap-4 sm:grid-cols-2" @submit.prevent="handleSubmit">
        <div
          v-if="submitError"
          role="alert"
          class="flex gap-3 rounded-2xl bg-error-soft px-4 py-3.5 text-error sm:col-span-2"
        >
          <svg class="mt-0.5 size-5 shrink-0 fill-none stroke-current stroke-2" viewBox="0 0 24 24" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
            <circle cx="12" cy="12" r="9" /><path d="M12 8v4.5M12 16h.01" />
          </svg>
          <p class="font-semibold">{{ submitError }}</p>
        </div>

        <!-- Honeypot for Web3Forms: hidden from people and assistive tech, bots tick it. -->
        <input v-model="botcheck" type="checkbox" name="botcheck" class="hidden" tabindex="-1" autocomplete="off" aria-hidden="true" />

        <div v-for="field in fields" :key="field.key" :class="field.wide && 'sm:col-span-2'">
          <div
            class="group relative overflow-hidden rounded-2xl ring-1 transition-[background-color,box-shadow] duration-300 focus-within:bg-surface focus-within:shadow-[0_18px_40px_-24px_rgb(18_36_28/0.45)]"
            :class="
              fieldInvalid(field.key)
                ? 'bg-error-soft/50 ring-error focus-within:ring-2'
                : 'bg-mist-soft ring-line hover:ring-line-strong/70 focus-within:ring-2 focus-within:ring-evergreen'
            "
          >
            <label
              :for="`contact-${field.key}`"
              class="flex cursor-text items-center gap-2.5 px-4 pt-3.5 text-sm font-semibold transition-colors"
              :class="fieldInvalid(field.key) ? 'text-error' : 'text-quiet group-focus-within:text-evergreen'"
            >
              <span class="font-display text-xs font-bold tabular-nums opacity-70">{{ field.index }}</span>
              <span class="h-px w-4 bg-current opacity-40" aria-hidden="true"></span>
              {{ field.label }}

              <span class="ml-auto grid size-5 place-items-center" aria-hidden="true">
                <svg
                  v-if="fieldValid(field.key)"
                  class="size-5 fill-none stroke-evergreen stroke-[2.5]"
                  viewBox="0 0 24 24"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                >
                  <path d="M20 6 9 17l-5-5" />
                </svg>
                <svg
                  v-else-if="fieldInvalid(field.key)"
                  class="size-5 fill-none stroke-error stroke-2"
                  viewBox="0 0 24 24"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                >
                  <circle cx="12" cy="12" r="9" /><path d="M12 8v4.5M12 16h.01" />
                </svg>
              </span>
            </label>

            <textarea
              v-if="field.type === 'textarea'"
              :id="`contact-${field.key}`"
              v-model="formData[field.key]"
              rows="5"
              :maxlength="field.max"
              :placeholder="field.placeholder"
              :aria-invalid="fieldInvalid(field.key)"
              :aria-describedby="describedBy(field.key)"
              class="block field-sizing-content min-h-36 max-h-96 w-full resize-none bg-transparent px-4 pt-1.5 pb-2 text-lg leading-relaxed text-ink placeholder:text-quiet/55 focus:outline-none focus-visible:outline-none"
              @input="handleInput(field.key)"
              @blur="handleBlur(field.key)"
            ></textarea>
            <input
              v-else
              :id="`contact-${field.key}`"
              v-model="formData[field.key]"
              :type="field.type"
              :autocomplete="field.autocomplete"
              :maxlength="field.max"
              :placeholder="field.placeholder"
              :aria-invalid="fieldInvalid(field.key)"
              :aria-describedby="describedBy(field.key)"
              class="block min-h-12 w-full bg-transparent px-4 pt-1 pb-3.5 text-lg text-ink placeholder:text-quiet/55 focus:outline-none focus-visible:outline-none"
              @input="handleInput(field.key)"
              @blur="handleBlur(field.key)"
            />

            <!-- Character count and a thin meter for the message -->
            <div
              v-if="field.key === 'message'"
              id="contact-message-count"
              class="flex items-center gap-3 px-4 pb-3.5 text-xs font-semibold text-quiet"
            >
              <span class="h-1 flex-1 overflow-hidden rounded-full bg-track" aria-hidden="true">
                <span
                  class="block h-full origin-left rounded-full transition-[transform,background-color] duration-300"
                  :class="messageLength >= MESSAGE_MIN ? 'bg-evergreen' : 'bg-line-strong/60'"
                  :style="{ transform: `scaleX(${messageProgress})` }"
                ></span>
              </span>
              <span class="tabular-nums">
                <template v-if="messageLength < MESSAGE_MIN">{{ MESSAGE_MIN - messageLength }} more to go · </template>
                {{ messageLength }} / {{ field.max }}
              </span>
            </div>

            <!-- Marigold underline that draws in on focus -->
            <span
              class="pointer-events-none absolute inset-x-4 bottom-0 h-0.5 origin-left scale-x-0 rounded-full transition-transform duration-500 ease-glide group-focus-within:scale-x-100"
              :class="fieldInvalid(field.key) ? 'bg-error' : 'bg-marigold'"
              aria-hidden="true"
            ></span>
          </div>

          <p
            v-if="fieldInvalid(field.key)"
            :id="`contact-${field.key}-error`"
            class="mt-2 px-1 text-sm font-semibold text-error"
          >
            {{ errors[field.key] }}
          </p>

          <!-- Quick picks for the subject -->
          <div
            v-if="field.key === 'subject'"
            role="group"
            aria-label="Common subjects"
            class="mt-3 flex flex-wrap gap-2"
          >
            <button
              v-for="topic in topics"
              :key="topic"
              type="button"
              :aria-pressed="formData.subject === topic"
              class="inline-flex min-h-9 items-center gap-1.5 rounded-full border px-3.5 text-sm font-semibold transition-colors"
              :class="
                formData.subject === topic
                  ? 'border-evergreen bg-evergreen text-on-evergreen'
                  : 'border-line bg-surface text-quiet hover:border-evergreen hover:text-evergreen'
              "
              @click="pickTopic(topic)"
            >
              <svg
                v-if="formData.subject === topic"
                class="size-3.5 fill-none stroke-current stroke-3"
                viewBox="0 0 24 24"
                stroke-linecap="round"
                stroke-linejoin="round"
                aria-hidden="true"
              >
                <path d="M20 6 9 17l-5-5" />
              </svg>
              {{ topic }}
            </button>
          </div>
        </div>

        <div class="mt-4 flex flex-col-reverse gap-4 sm:col-span-2 sm:flex-row sm:items-center sm:justify-between">
          <p class="flex items-center gap-2 text-sm text-quiet">
            <svg class="size-4 shrink-0 fill-none stroke-current stroke-2" viewBox="0 0 24 24" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
              <rect x="4" y="10" width="16" height="11" rx="2" /><path d="M8 10V7a4 4 0 0 1 8 0v3" />
            </svg>
            Only used to reply to you.
          </p>

          <button
            type="submit"
            :disabled="isSubmitting"
            class="group inline-flex min-h-14 items-center justify-between gap-4 rounded-full bg-evergreen pr-2 pl-7 text-lg font-semibold text-on-evergreen shadow-[0_14px_30px_-14px_rgb(30_91_68/0.8)] transition-colors hover:bg-evergreen-hover disabled:cursor-wait disabled:opacity-80 sm:justify-center"
          >
            {{ isSubmitting ? 'Sending…' : 'Send message' }}
            <span class="grid size-10 place-items-center rounded-full bg-marigold text-[#12241c] transition-transform duration-300 group-hover:-rotate-45">
              <svg
                v-if="!isSubmitting"
                class="size-5 fill-none stroke-current stroke-[2.25]"
                viewBox="0 0 24 24"
                stroke-linecap="round"
                stroke-linejoin="round"
                aria-hidden="true"
              >
                <path d="M5 12h14M13 6l6 6-6 6" />
              </svg>
              <svg v-else class="size-5 animate-spin fill-none stroke-current stroke-[2.25]" viewBox="0 0 24 24" aria-hidden="true">
                <path d="M21 12a9 9 0 1 1-6.2-8.6" stroke-linecap="round" />
              </svg>
            </span>
          </button>
        </div>
      </form>
    </Transition>
  </div>
</template>
