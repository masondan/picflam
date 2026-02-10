<script>
  import '$lib/styles/modal-base.css';
  
  export let message = '';
  export let confirmText = 'Yes';
  export let cancelText = 'Cancel';
  export let onConfirm = () => {};
  export let onCancel = () => {};
</script>

<div 
  class="modal-overlay" 
  on:click={onCancel}
  on:keydown={(e) => e.key === 'Escape' && onCancel()}
  role="dialog"
  aria-modal="true"
  tabindex="-1"
>
  <div class="modal" on:click|stopPropagation on:keydown|stopPropagation role="document">
    <p class="modal-message">{@html message}</p>
    <div class="modal-actions">
      <button class="modal-btn" on:click={onCancel}>{cancelText}</button>
      <button class="modal-btn" on:click={onConfirm}>{confirmText}</button>
    </div>
  </div>
</div>

<style>
  .modal-message-first {
    color: #333333;
  }
  
  .modal-message-second {
    color: var(--color-text-primary);
  }
</style>
