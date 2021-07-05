<script lang="typescript">
  import { backendServerUrl } from "../../stores";
  console.log("Header");
</script>

<div class="header-container">
  <section class="logo">
    <div class="logo__aws">
      <img src="https://upload.wikimedia.org/wikipedia/commons/9/93/Amazon_Web_Services_Logo.svg" alt="aws-logo" />
    </div>
  </section>
  <section class="menu">
    <ol>
      <li class="menu-item">
        <a href="#0">HOME<i class="fas fa-angle-down" /></a>
        <ol class="sub-menu">
          <li class="menu-item"><a href="#0">View</a></li>
          <li class="menu-item"><a href="#0">Update</a></li>
        </ol>
      </li>
      <li class="menu-item"><a href={`${$backendServerUrl}/v1/aws/auth`}>LOGIN</a></li>
    </ol>
  </section>
</div>

<style lang="scss">
  .header-container {
    // Inherit from Parent Svelte
    grid-area: header;

    // Divide areas
    display: grid;
    grid-template-rows: repeat(3, 1fr);
    grid-template-columns: repeat(10, 1fr);
    grid-template-areas:
      "logo . . . . . . menu menu menu"
      "logo . . . . . . menu menu menu" //2
      "logo . . . . . . menu menu menu"; //3

    // Element options
    height: 100%;
    background-color: var(--header-bg-color);
  }

  .logo {
    // Inherit from Parent Class
    grid-area: logo;

    img {
      height: 1.5vw;
    }

    &__aws {
      // Element options
      display: flex;
      justify-content: center;
      flex-direction: column;
      height: 100%;
    }
  }

  .menu {
    // Inherit from Parent Class
    grid-area: menu;

    // Element options
    display: flex;
    justify-content: center;
    flex-direction: column;
    height: 100%;

    // Dropmenu level: ol > li > ol > li
    ol {
      list-style: none;
      text-align: left;
      display: inline;
      margin: 0;
    }

    li {
      display: inline-block;
      margin-right: -0.1vw;
      position: relative;
      padding: 1vh 1.2vw;
      cursor: pointer;
      transition: all 0.2s;
    }

    li:hover {
      background: var(--drop-menu-bg-color);

      i {
        transform: rotate(180deg);
      }
    }

    li:hover ol {
      display: block;
      opacity: 1;
      visibility: visible;
    }

    a {
      color: var(--main-font-color);
    }

    i {
      margin-left: 0.5vw;
    }

    .sub-menu {
      padding: 0;
      position: absolute;
      top: 4vh;
      left: 0;
      width: 5vw;
      box-shadow: none;
      display: none;
      opacity: 0;
      visibility: hidden;
      transition: opacity 0.2s;

      li {
        float: none;
        background: var(--drop-menu-bg-color);
        display: block;
        color: var(--main-font-color);
        text-shadow: 0 -1px 0 var(--header-bg-color);
      }

      li:hover {
        background: var(--drop-menu-deep-bg-color);
      }
    }
  }
</style>
