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

const getInputClasses = (field: keyof FormData) => {
  const baseClasses = 'w-full px-3 sm:px-4 py-2 sm:py-2.5 md:py-3 bg-elegant-black/40 rounded-lg text-elegant-off-white text-xs sm:text-sm placeholder-elegant-soft-gray focus:outline-none transition-all';
  
  if (touched[field] && errors[field]) {
    return `${baseClasses} border-2 border-red-500 focus:border-red-500 focus:ring-2 focus:ring-red-500/20`;
  }
  
  if (touched[field] && !errors[field] && formData[field].trim()) {
    return `${baseClasses} border-2 border-green-500 focus:border-green-500 focus:ring-2 focus:ring-green-500/20`;
  }
  
  return `${baseClasses} border border-elegant-white/20 focus:border-elegant-white focus:ring-2 focus:ring-elegant-white/20`;
};
</script>

<template>
  <div class="contact-form-card bg-elegant-dark-gray/40 backdrop-blur-lg rounded-xl sm:rounded-2xl p-4 sm:p-5 md:p-6 lg:p-8 border border-elegant-white/10 shadow-2xl">
    <h3 class="text-lg sm:text-xl lg:text-2xl font-bold text-elegant-white mb-4 sm:mb-5 md:mb-6">
      Send a Message
    </h3>
    
    <div v-if="submitSuccess" class="mb-4 sm:mb-5 md:mb-6 p-3 sm:p-4 bg-green-500/20 border border-green-500 rounded-lg">
      <p class="text-green-400 text-xs sm:text-sm font-medium">Message sent successfully! I'll get back to you soon.</p>
    </div>
    
    <div v-if="submitError" class="mb-4 sm:mb-5 md:mb-6 p-3 sm:p-4 bg-red-500/20 border border-red-500 rounded-lg">
      <p class="text-red-400 text-xs sm:text-sm font-medium">{{ submitError }}</p>
    </div>
    
    <form @submit="handleSubmit" class="space-y-3.5 sm:space-y-4 md:space-y-5">
      <div class="grid grid-cols-1 sm:grid-cols-2 gap-3.5 sm:gap-4 md:gap-5">
        <div>
          <label for="contact-name" class="block text-xs sm:text-sm font-medium text-elegant-off-white mb-1.5 sm:mb-2">
            Name
          </label>
          <input
            type="text"
            id="contact-name"
            v-model="formData.name"
            @input="handleInput('name')"
            @blur="handleBlur('name')"
            placeholder="John Doe"
            :class="getInputClasses('name')"
          />
          <transition name="fade">
            <p v-if="touched.name && errors.name" class="mt-1 sm:mt-1.5 text-xs text-red-400">
              {{ errors.name }}
            </p>
          </transition>
        </div>
        
        <div>
          <label for="contact-email" class="block text-xs sm:text-sm font-medium text-elegant-off-white mb-1.5 sm:mb-2">
            Email
          </label>
          <input
            type="text"
            id="contact-email"
            v-model="formData.email"
            @input="handleInput('email')"
            @blur="handleBlur('email')"
            placeholder="john@example.com"
            :class="getInputClasses('email')"
          />
          <transition name="fade">
            <p v-if="touched.email && errors.email" class="mt-1 sm:mt-1.5 text-xs text-red-400">
              {{ errors.email }}
            </p>
          </transition>
        </div>
      </div>
      
      <div>
        <label for="contact-subject" class="block text-xs sm:text-sm font-medium text-elegant-off-white mb-1.5 sm:mb-2">
          Subject
        </label>
        <input
          type="text"
          id="contact-subject"
          v-model="formData.subject"
          @input="handleInput('subject')"
          @blur="handleBlur('subject')"
          placeholder="Project Inquiry"
          :class="getInputClasses('subject')"
        />
        <transition name="fade">
          <p v-if="touched.subject && errors.subject" class="mt-1 sm:mt-1.5 text-xs text-red-400">
            {{ errors.subject }}
          </p>
        </transition>
      </div>
      
      <div>
        <label for="contact-message" class="block text-xs sm:text-sm font-medium text-elegant-off-white mb-1.5 sm:mb-2">
          Message
        </label>
        <textarea
          id="contact-message"
          v-model="formData.message"
          @input="handleInput('message')"
          @blur="handleBlur('message')"
          rows="5"
          placeholder="Tell me about your project..."
          :class="getInputClasses('message') + ' resize-none'"
        ></textarea>
        <transition name="fade">
          <p v-if="touched.message && errors.message" class="mt-1 sm:mt-1.5 text-xs text-red-400">
            {{ errors.message }}
          </p>
        </transition>
      </div>
      
      <div class="pt-1 sm:pt-2">
        <button
          type="submit"
          :disabled="!isFormValid || isSubmitting"
          class="group w-full inline-flex items-center justify-center gap-1.5 sm:gap-2 px-5 sm:px-6 py-2.5 sm:py-3 md:py-3.5 bg-elegant-white hover:bg-elegant-off-white text-elegant-black font-semibold text-xs sm:text-sm rounded-lg transition-all duration-300 transform hover:scale-[1.02] hover:shadow-2xl hover:shadow-elegant-white/30 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 disabled:hover:shadow-none"
        >
          <span v-if="!isSubmitting">Send Message</span>
          <span v-else>Sending...</span>
          <svg v-if="!isSubmitting" class="w-3.5 h-3.5 sm:w-4 sm:h-4 transition-transform duration-300 group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14 5l7 7m0 0l-7 7m7-7H3"></path>
          </svg>
          <svg v-else class="w-3.5 h-3.5 sm:w-4 sm:h-4 animate-spin" fill="none" viewBox="0 0 24 24">
            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
            <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
        </button>
      </div>
    </form>
  </div>
</template>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
