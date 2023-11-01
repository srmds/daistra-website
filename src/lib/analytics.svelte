<script lang="ts">
    import { page } from '$app/stores'

    $: {
    if (typeof gtag !== 'undefined') {
      gtag('config', 'G-73RC0XF497', {
        page_title: document.title,
        page_path: $page.url.pathname,
      })
    }
  }
</script>