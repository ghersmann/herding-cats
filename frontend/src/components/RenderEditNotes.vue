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
        <div class="dual-btns">
          <button @click="cancelEditing" class="cncl-btn">Cancel</button>
          <button @click="finishEditing" class="save-btn">Save</button>
        </div>
      </slot>
    </div>

    <!-- Delete button -->
    <button @click="deleteNote" class="delete-btn">x</button>
  </div>
</template>

<script>
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
      isEditing: false,
      editableNoteText: this.noteText,
    };
  },
  methods: {
    setEditableNoteText(newText) {
      this.editableNoteText = newText;
    },
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
    },
  },
};
</script>


<style scoped>
.delete-btn {
  position: absolute;
  top: 1rem;
  right: 1rem;
}

.save-btn,
.cncl-btn {
  font-size: 1.2rem;
  width: fit-content;
  height: 2.2rem;
  margin-right: 1rem;
  margin-left: 1rem;
}

.cncl-btn {
  margin-left: auto;
  margin-right: 0;
  background-color: var(--required-red);
}

.dual-btns {
  display: flex;
  justify-content: space-between;
}
</style>
