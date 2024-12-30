<template>
  <div :class="{ 'note-box--editing': isEditing }" class="list-item">
    <!-- Show the note text only if not editing -->
    <div v-if="!isEditing">
      <slot name="note" :text="editableNoteText" :start-editing="startEditing">
        <p @click="startEditing" class="render-list-p">
          {{ noteText }}
        </p>
      </slot>
    </div>

    <!-- Show the textarea only when editing -->
    <div
      v-else
      class="edit-mode"
      :class="[customEditClass]"
    >
      <slot
        name="edit"
        :text="editableNoteText"
        :set-text="setEditableNoteText"
        :cancel-editing="cancelEditing"
        :finish-editing="finishEditing"
      >
        <textarea
          v-model="editableNoteText"
          ref="textarea"
          @keyup="adjustTextarea"
        ></textarea>
        <div class="trio-btns">
          <button @click="deleteNote" class="trio-del-btn">Delete</button>
          <button @click="cancelEditing" class="trio-cncl-btn">Cancel</button>
          <button @click="finishEditing" class="trio-save-btn">Save</button>
        </div>
      </slot>
    </div>
  </div>
</template>

<script>
import { herdingCatsstore } from '@/stores/counter.js';

export default {
  props: {
    noteText: {
      type: String,
      required: true,
    },
    customEditClass: {
      type: String,
      default: '',
    },
  },
  data() {
    return {
      state: herdingCatsstore(),
      isEditing: false,
      editableNoteText: this.noteText,
    };
  },
  methods: {
    setEditableNoteText(newText) {
      this.editableNoteText = newText;
    },
    startEditing() {
      if (this.state.isUserThere) {
      this.isEditing = true;
      this.$nextTick(this.adjustTextarea);
      }
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
  if (confirm('Are you sure you wish to delete this?')) {
    this.$emit('delete-note');
    this.isEditing = false;
  }
}
  },
};
</script>


<style scoped>
.trio-btns {
  display: flex;
  justify-content: flex-end;
  align-items: flex-end;
  margin-right: 0;
  margin-left: auto;
  width: 20rem;
}

.trio-del-btn,
.trio-save-btn,
.trio-cncl-btn {
  border-radius: 0.5rem;
  font-size: 1.2rem;
  width: fit-content;
  height: 2.2rem;
  margin: 0.3rem;
}

.trio-del-btn {
  background-color: var(--required-red);
}

.trio-cncl-btn {
  background-color: var(--dark-button-blue);
}

.trio-save-btn {
  background-color: var(--green-travel);
  margin-right: 0;
}
</style>
