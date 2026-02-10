<script>
  import '$lib/styles/modal-base.css';
  
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
      <button class="modal-btn" on:click={onAction}>{actionText}</button>
    </div>
  </div>
</div>


