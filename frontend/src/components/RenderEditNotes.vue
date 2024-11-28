<template>
  <div :class="{ 'note-box--editing': isEditing }">
    <!-- Use a slot for rendering the note text -->
    <slot name="note" :text="editableNoteText" :start-editing="startEditing">
      <p v-if="!isEditing" @click="startEditing" class="render-list-p">{{ noteText }}</p>
    </slot>

    <!-- Display textarea in edit mode -->
    <div v-if="isEditing">
      <textarea
        v-model="editableNoteText"
        ref="textarea"
        @keyup="adjustTextarea"
      ></textarea>
      <div>
        <button @click="cancelEditing">Cancel</button>
        <button @click="finishEditing">Save</button>
      </div>
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
  },
  data() {
    return {
      isEditing: false,
      editableNoteText: this.noteText,
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
    },
  },
};
</script>
