<script lang="typescript">
  import Router from "svelte-spa-router";
  import routes from "./routes";
</script>

<body>
  <Router {routes} />
</body>

<style type="text/scss">
  :root {
    // Main
    --main-font-color: #f2f2f2;
    --main-font-size: 15px;
    --main-important-color: #cad7e2;

    // Header(Global Nav)
    --header-bg-color: #0d0d0d;
    --drop-menu-bg-color: #555555;
    --drop-menu-deep-bg-color: #666666;

    // Side Menu
    --side-menu-bg-color: #d9d9d9;

    // Header(Content)
    --header-content-bg-color: #478ac9;
    --header-content-bg-deep-color: #a0a0a0;

    // Alarm
    --alarm-success: #2042ff;
    --alarm-fail: #97122f;
    --alarm-info: #2eb90b;

    // Border
    --border-radius: 2px;
  }
</style>
