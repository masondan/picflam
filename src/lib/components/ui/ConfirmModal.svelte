<script>
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
    <p class="modal-message">{message}</p>
    <div class="modal-actions">
      <button class="btn-text" on:click={onCancel}>{cancelText}</button>
      <button class="btn-text btn-confirm" on:click={onConfirm}>{confirmText}</button>
    </div>
  </div>
</div>

<style>
  .modal-overlay {
    position: fixed;
    inset: 0;
    background-color: rgba(0, 0, 0, 0.4);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 200;
    padding: var(--space-4);
  }
  
  .modal {
    width: 100%;
    max-width: 280px;
    background-color: var(--color-surface);
    border-radius: var(--radius-lg);
    padding: var(--space-6);
    box-shadow: var(--shadow-lg);
  }
  
  .modal-message {
    text-align: center;
    color: var(--color-text-primary);
    font-size: var(--font-size-base);
    margin: 0 0 var(--space-6) 0;
    line-height: var(--line-height-normal);
  }
  
  .modal-actions {
    display: flex;
    justify-content: space-between;
  }
  
  .btn-text {
    background: none;
    border: none;
    padding: var(--space-2) var(--space-3);
    color: var(--color-text-secondary);
    font-size: var(--font-size-base);
    cursor: pointer;
  }
  
  .btn-text:hover {
    color: var(--color-text-primary);
  }
  
  .btn-confirm {
    font-weight: var(--font-weight-medium);
  }
</style>
