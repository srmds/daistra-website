<!-- Originally posted on https://webjeda.com/blog/back-to-top-svelte-component/ -->
<script>
    export let showAtPixel = 600;
  
    let scrollHeight = 0;
  
    const gotoTop = () => {
          window.scrollTo({ top: 0, behavior: 'smooth' })
    };
  
    $: showGotoTop = scrollHeight > showAtPixel;
  </script>
  
  {#if showGotoTop}
    <button on:click={gotoTop} class="goto__top" title="Go to top"
      ><svg
        xmlns="http://www.w3.org/2000/svg"
        width="48"
        height="48"
        viewBox="0 0 32 32">
        <g 
            fill="blue" 
            stroke="grey" 
            stroke-width="2.5">
          <path
            fill="white"
            d="M2 12c0-4.714 0-7.071 1.464-8.536C4.93 2 7.286 2 12 2c4.714 0 7.071 0 8.535 1.464C22 4.93 22 7.286 22 12c0 4.714 0 7.071-1.465 8.535C19.072 22 16.714 22 12 22s-7.071 0-8.536-1.465C2 19.072 2 16.714 2 12Z"/>
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            d="m15 13.5l-3-3l-3 3"
        />
        </g>
      </svg></button
    >
   <path 
       stroke-linecap="round" 
       stroke-linejoin="round" 
       d="M12 21v-8.25M15.75 21v-8.25M8.25 21v-8.25M3 9l9-6 9 6m-1.5 12V10.332A48.36 48.36 0 0012 9.75c-2.551 0-5.056.2-7.5.582V21M3 21h18M12 6.75h.008v.008H12V6.75z" 
       fill="currentColor"
   />
  {/if}
  
  <svelte:window bind:scrollY={scrollHeight} />
  
  <style>
    .goto__top {
      position: fixed;
      right: 1rem;
      bottom: 5rem;
      cursor: pointer;
      color: #999;
      border-radius: 0.15rem;
      transition-duration: 300ms;
      z-index: 999;
          background: none;
          border: none;
          padding: 0;
    }
    .goto__top:hover {
      transform: translateY(-10px);
    }
  </style>
  