<template>
    <div :class="['note-box', { 'note-box--editing': isEditing }]">
      <!-- Display note text or textarea based on edit mode -->
      <p v-if="!isEditing" class="list-p" @click="startEditing">{{ noteText }}</p>
  
      <div v-else>
        <textarea
          class="edit-note"
          v-model="editableNoteText"
          ref="textarea"
          @keyup="adjustTextarea"
        ></textarea>
        <div class="edit-btns">
          <button class="save-btn cncl-btn" @click="cancelEditing">Cancel</button>
          <button class="save-btn" @click="finishEditing">Save</button>
        </div>
      </div>
  
      <!-- Delete button for the note -->
      <button class="delete-btn" @click="deleteNote">x</button>
    </div>
  </template>
  
  <script>
  export default {
    props: {
      noteText: {
        type: String,
        required: true
      }
    },
    data() {
      return {
        isEditing: false,
        editableNoteText: this.noteText
      };
    },
    methods: {
      startEditing() {
        this.isEditing = true;
        this.$nextTick(this.adjustTextarea);
      },
      adjustTextarea() {
        const textarea = this.$refs.textarea;
        if (textarea) {
          textarea.style.height = 'auto';
          textarea.style.height = `${textarea.scrollHeight}px`;
        }
      },
      cancelEditing() {
        this.editableNoteText = this.noteText;
        this.isEditing = false;
      },
      finishEditing() {
        this.$emit('update-note', this.editableNoteText);
        this.isEditing = false;
      },
      deleteNote() {
        this.$emit('delete-note');
      }
    }
  };
  </script>
  
  <style scoped>
.note-box {
  padding: 1.4rem;
  background: linear-gradient(150deg, #efec88 0%, #fefabc 100%);
  box-shadow: 0px 0.2rem 0.4rem rgba(0, 0, 0, 0.25);
  width: 28rem;
}

.note-box--editing {
  box-shadow: white 0px 0px 1rem;
}
  
.edit-note {
  background: rgb(0 0 0 / 0%);
  box-sizing: inherit;
  margin: 0;
  padding: 0;
  border: none;
  width: 100%;
  height: auto;
  overflow-y: auto;
  box-shadow: none;
}

.edit-note:hover,
.edit-note:active,
.edit-note:focus {
  box-shadow: none;
  outline: none;
}

.delete-btn {
  position: absolute;
  top: 1rem;
  right: 1rem;
}
  </style>
  