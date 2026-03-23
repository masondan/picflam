<script>
	/** @type {'crop' | 'ai' | 'design'} */
	export let activeTab = 'crop';
	
	/** @type {(tab: 'crop' | 'ai' | 'design') => void} */
	export let onTabChange;
</script>

<header class="header">
	<div class="header-left">
		<flam-nav current="picflam"></flam-nav>
		<img 
			src="/logos/logo-picflam-logotype.png" 
			alt="PicFlam" 
			class="header-logo"
		/>
	</div>
	
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
		padding: 16px var(--space-6);
		border-bottom: 1px solid #aaaaaa;
		background-color: var(--color-surface);
	}
	
	.header-logo {
		height: 26px;
		width: auto;
	}

	.header-left {
		display: flex;
		align-items: center;
		gap: var(--space-2);
	}
	
	.header-nav {
		display: flex;
		gap: var(--space-2);
	}
	
	.nav-btn {
		width: 36px;
		height: 36px;
		display: flex;
		align-items: center;
		justify-content: center;
		border-radius: var(--radius-full);
		border: none;
		background-color: #f0f0f0;
		transition: background-color var(--transition-fast);
	}
	
	.nav-btn:hover:not(.active) {
		background-color: #e4e4e4;
	}
	
	.nav-btn.active {
		background-color: #5422b0;
	}
	
	.nav-icon {
		width: 22px;
		height: 22px;
	}
	
	.nav-btn:not(.active) .nav-icon {
		filter: brightness(0) saturate(100%) invert(25%) sepia(0%) saturate(0%) brightness(100%) contrast(90%);
	}
	
	.nav-btn.active .nav-icon {
		filter: brightness(0) invert(1);
	}
</style>
