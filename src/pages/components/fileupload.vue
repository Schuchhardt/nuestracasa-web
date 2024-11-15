<template>
    <div>
      <input type="file" ref="fileInput" @change="handleFileUpload" style="display: none;" multiple />
      <VChip
            label
            color="primary"
            size="small"
            @click="triggerFileInput"
                  >
                    <VIcon
                      start
                      icon="mdi-link"
                    />
                    Adjuntar imagen
                  </VChip>
        <ul class="pa-10" v-if="selectedFiles.length">
            <li v-for="file in selectedFiles" :key="file.name">{{ file.name }}</li>
        </ul>
        <p v-if="message">{{ message }}</p>
    </div>
  </template>
<script lang="ts">
import axios from 'axios';
import { ref, Ref } from 'vue';

export default {
  name: 'FileUpload',
  emits: ['isUploading', 'filesUploaded'],
  setup(props, ctx) {
    const fileInput: Ref<HTMLInputElement | null> = ref(null);
    const selectedFiles: Ref<File[]> = ref([]);
    const message: Ref<string> = ref("");

    const handleFileUpload = () => {
      if (fileInput.value?.files?.length) {
        selectedFiles.value = Array.from(fileInput.value.files); // Convert FileList to array
        uploadFiles(); // Automatically start uploading after selecting files
      }
    };

    const triggerFileInput = () => {
      fileInput.value?.click(); // Programmatically triggers the click event of the hidden file input
    };

    const uploadFiles = async () => {

      const formData = new FormData();
      selectedFiles.value.forEach(file => {
        formData.append('files', file);
      });
      
      try {
        ctx.emit('isUploading', true);
        const response = await axios.post(process.env.API_URL + '/upload_files', formData, {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('accessToken')}`,
            'Content-Type': 'multipart/form-data'
          }
        });

        if (response.status === 200) {
          console.log("Files uploaded successfully!", response.data);
          ctx.emit('filesUploaded', response.data.uploadedFilesURLs);
        } else {
          message.value = response.data.message || "Hubo un error al cargar los archivos. Reintente";
        }
        ctx.emit('isUploading', false);
      } catch (error) {
        message.value = "No se pudieron subir los archivos.";
        console.error(error)
        ctx.emit('isUploading', false);
      }
    };

    return {
      fileInput,
      handleFileUpload,
      triggerFileInput,
      selectedFiles,
      message
    };
  }
}
</script>
<style scoped>
button {
  margin-top: 10px;
  padding: 5px 15px;
}
p {
  margin-top: 10px;
  color: red;
}
</style>