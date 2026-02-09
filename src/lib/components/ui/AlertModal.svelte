<script>
  export let message = '';
  export let actionText = 'Got it';
  export let onAction = () => {};
</script>

<div 
  class="modal-overlay" 
  on:click={onAction}
  on:keydown={(e) => e.key === 'Escape' && onAction()}
  role="dialog"
  aria-modal="true"
  tabindex="-1"
>
  <div class="modal" on:click|stopPropagation on:keydown|stopPropagation role="document">
    <p class="modal-message">{@html message}</p>
    <div class="modal-actions">
      <button class="btn-action" on:click={onAction}>{actionText}</button>
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
    max-width: 220px;
    background-color: var(--color-surface);
    border-radius: var(--radius-lg);
    padding: var(--space-4) var(--space-3) var(--space-3) var(--space-3);
    box-shadow: var(--shadow-lg);
    display: flex;
    flex-direction: column;
  }
  
  .modal-message {
    text-align: center;
    font-size: var(--font-size-base);
    margin: 0 0 var(--space-2) 0;
    line-height: var(--line-height-normal);
    color: var(--color-text-primary);
  }

  :global(.modal-message-first) {
    color: #333333;
  }

  :global(.modal-message-second) {
    color: var(--color-text-primary);
  }
  
  .modal-actions {
    display: flex;
    justify-content: flex-end;
    max-width: 50%;
    margin-left: auto;
  }
  
  .btn-action {
    background: none;
    border: none;
    padding: var(--space-2) var(--space-3);
    color: var(--color-text-secondary);
    font-size: var(--font-size-base);
    font-weight: var(--font-weight-bold);
    cursor: pointer;
  }
  
  .btn-action:hover {
    color: var(--color-text-primary);
    opacity: 0.8;
  }
</style>
