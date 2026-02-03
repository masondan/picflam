<script>
	/** @type {'crop' | 'ai' | 'design'} */
	export let activeTab = 'crop';
	
	/** @type {(tab: 'crop' | 'ai' | 'design') => void} */
	export let onTabChange;
</script>

<header class="header">
	<img 
		src="/logos/logo-picflam-logotype.png" 
		alt="PicFlam" 
		class="header-logo"
	/>
	
	<nav class="header-nav">
		<button
			class="nav-btn"
			class:active={activeTab === 'crop'}
			on:click={() => onTabChange('crop')}
			aria-label="Crop tab"
		>
			<img src="/icons/icon-crop.svg" alt="" class="nav-icon" />
		</button>
		
		<button
			class="nav-btn"
			class:active={activeTab === 'ai'}
			on:click={() => onTabChange('ai')}
			aria-label="AI tab"
		>
			<img src="/icons/icon-ai.svg" alt="" class="nav-icon" />
		</button>
		
		<button
			class="nav-btn"
			class:active={activeTab === 'design'}
			on:click={() => onTabChange('design')}
			aria-label="Design tab"
		>
			<img src="/icons/icon-design.svg" alt="" class="nav-icon" />
		</button>
	</nav>
</header>

<style>
	.header {
		display: flex;
		align-items: center;
		justify-content: space-between;
		height: 64px;
		padding: 0 var(--space-6);
		border-bottom: 1px solid #999999;
		background-color: var(--color-surface);
	}
	
	.header-logo {
		height: 24px;
		width: auto;
	}
	
	.header-nav {
		display: flex;
		gap: var(--space-2);
	}
	
	.nav-btn {
		width: 40px;
		height: 40px;
		display: flex;
		align-items: center;
		justify-content: center;
		border-radius: var(--radius-full);
		border: 1px solid #777777;
		background: transparent;
		transition: all var(--transition-fast);
	}
	
	.nav-btn:hover:not(.active) {
		background-color: var(--color-border-light);
	}
	
	.nav-btn.active {
		background-color: var(--color-primary);
		border-color: var(--color-primary);
	}
	
	.nav-icon {
		width: 20px;
		height: 20px;
	}
	
	.nav-btn:not(.active) .nav-icon {
		filter: brightness(0) saturate(100%) invert(45%) sepia(0%) saturate(0%) hue-rotate(0deg) brightness(95%) contrast(90%);
	}
	
	.nav-btn.active .nav-icon {
		filter: brightness(0) invert(1);
	}
</style>
