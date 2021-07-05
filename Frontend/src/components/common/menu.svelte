<script lang="typescript">
  console.log("Menu");
</script>

<div class="menu-container">
  <section class="menu">
    <ol>
      <li class="menu-item">
        <a href="#0"><i class="fas fa-angle-down" /><span>메인</span></a>
      </li>
      <li class="menu-item">
        <a href="#0"><i class="fas fa-angle-down" /><span>사용량</span></a>
        <ol class="sub-menu">
          <li class="menu-item"><a href="#0">전체 사용량</a></li>
          <li class="menu-item">
            <a href="#/aws/loadbalancer">Zone별 전기사용량</a>
          </li>
          <li class="menu-item"><a href="#0">부하별 전기사용량</a></li>
          <li class="menu-item"><a href="#0">CO2 배출량</a></li>
          <li class="menu-item"><a href="#0">모터 진단</a></li>
          <li class="menu-item"><a href="#0">전력 품질</a></li>
        </ol>
      </li>
      <li class="menu-item">
        <a href="#0"><i class="fas fa-angle-down" /><span>???</span></a>
      </li>
      <li class="menu-item">
        <a href="#0"><i class="fas fa-angle-down" /><span>알람</span></a>
      </li>
      <li class="menu-item">
        <a href="#0"><i class="fas fa-angle-down" /><span>설정</span></a>
      </li>
    </ol>
  </section>
</div>

<style lang="scss">
  .menu-container {
    grid-area: menu;
    height: 100%;
    box-shadow: 0px 0px 13px -7px var(--header-bg-color);
  }

  .menu {
    padding: 1vh 1vw;

    li {
      padding: 0.8vh 0;
    }

    i {
      margin-right: 0.5vw;
    }

    span {
      font-weight: 600;
    }

    .sub-menu {
      .menu-item {
        padding: 0.35vh 1vw;
      }
    }
  }
</style>
