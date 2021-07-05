<script lang="typescript">
  import Header from "../components/common/header.svelte";
  import Menu from "../components/common/menu.svelte";
  import Main from "../components/main/main.svelte";
</script>

<div class="container">
  <Header />
  <Menu />
  <Main />
</div>

<style type="text/scss">
  .container {
    height: 100%;
    display: grid;
    grid-template-rows: repeat(15, 1fr);
    grid-template-columns: repeat(10, 1fr);
    grid-template-areas:
      "header header header header header header header header header header"
      "menu main main main main main main main main main" //2
      "menu main main main main main main main main main" //3
      "menu main main main main main main main main main" //4
      "menu main main main main main main main main main" //5
      "menu main main main main main main main main main" //6
      "menu main main main main main main main main main" //7
      "menu main main main main main main main main main" //8
      "menu main main main main main main main main main" //9
      "menu main main main main main main main main main" //10
      "menu main main main main main main main main main" //11
      "menu main main main main main main main main main" //12
      "menu main main main main main main main main main" //13
      "menu main main main main main main main main main" //14
      "menu main main main main main main main main main"; //15
  }
</style>
