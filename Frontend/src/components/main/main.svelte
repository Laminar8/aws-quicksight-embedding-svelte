<script lang="typescript">
  import { onMount } from "svelte";
  import { embedDashboard } from 'amazon-quicksight-embedding-sdk';
  import { backendServerUrl } from "../../stores";
  import axios from "axios"
  
  let alarmMessage = "";
  let height = 0;
  // CHANGE THIS NAME
  const dashboardName = "<Your Dashboard Name>";

  const getParameterValues = (
    param: string,
    slicer: string,
    delimiter: string
  ) => {
    const urlParms = window.location.href
      .slice(window.location.href.indexOf(slicer) + slicer.length)
      .split(delimiter);
    for (let i = 0; i < urlParms.length; i++) {
      const urlparm = urlParms[i].split("=");
      if (urlparm[0].toLowerCase() === param) {
        setCookie(param, decodeURIComponent(urlparm[1]));
        if (param == "id_token") {
          //Remove the url fragments after the id_token has been stored into Cookies.
          //This is important as the cookie expiry is set to same time as validity of the token.
          window.location.hash = "";
        }
        return decodeURIComponent(urlparm[1]);
      }
    }
    return getCookie(param);
  };

  //Return value stored in cookie. If cookie is not found, null is returned.
  const getCookie = (name: string) => {
    // eslint-disable-next-line @typescript-eslint/prefer-regexp-exec
    const v = document.cookie.match("(^|;) ?" + name + "=([^;]*)(;|$)");
    return v ? v[2] : null;
  };

  //Sets cookies with an expiry of 1 hour.
  const setCookie = (name: string, value: string) => {
    document.cookie = name + "=" + value + "; Max-Age=3600; SameSite=Strict";
  };

  const EmbedDashboard = async (embedUrl: string, height) => {
      console.log(height)
      console.log(embedUrl);
      const containerDiv = document.getElementById("embeddingContainer");
      const options = {
          url: embedUrl,
          container: containerDiv,
          height: `${height}px`,
          scrolling: "yes",
      };
      const dashboard = await embedDashboard(options);
      dashboard.on("error", onError);
      dashboard.on("load", onDashboardLoad);
  };

  onMount(async () => {
    const idToken = getParameterValues("id_token", "#", "&");
    if (idToken) {
      //Once a valid to
      makeAlarm("Congratulations for your connection with AWS!", "success");
      const response = await axios({
        method: "GET",
        url: `${$backendServerUrl}/v1/aws`,
        params: {
          idToken,
          dashboardName,
        },
      });
      const embedUrl = await response.data;
      if (!embedUrl) {
        makeAlarm("We tried to get our dashboard url. The result is fail to draw a dashboard.", "fail");
      } else {
        const embededDashboard = await EmbedDashboard(embedUrl, height);
        makeAlarm("We are drawing our dashboard! Wait for a second.", "info");
      }
    }
  });
  
  const makeAlarm = (message: string, result: string) => {
    const alarm = document.getElementsByClassName(
      "alarm-content"
    ) as HTMLCollectionOf<HTMLElement>;
    alarm[0].style.display = "";
    alarm[0].style.visibility = "";
    alarmMessage = message;

    if (result === "success") {
      alarm[0].style["background-color"] = "var(--alarm-success)";
    } else if (result === "fail") {
      alarm[0].style["background-color"] = "var(--alarm-fail)";
    } else {
      alarm[0].style["background-color"] = "var(--alarm-info)";
    }
  };

  const closeAlarm = (event) => {
    event.path[1].style.display = "none";
    event.path[1].style.visibility = "hidden";
    alarmMessage = "";
  };
  
  const onDashboardLoad = (payload) => {
    makeAlarm("Enjoy your fully loaded dashboard!", "success")
  }

  const onError = (payload) => {
    makeAlarm("The dashboard fails loading. Reload this page.", "fail")
  }
</script>

<div class="main-container">
    <section class="alarm">
      <div class="alarm-content">
        {alarmMessage}
        <i class="fas fa-times" on:click={closeAlarm} />
      </div>
    </section>
    <section class="header">
      <div class="header-title">
        <span class="header-title-name">HEADER</span>
      </div>
    </section>
    <section class="content">
        <div class="content-chart" bind:clientHeight={height}>
          <div class="content-chart-main" id="embeddingContainer">
          </div>
        </div>
    </section>
</div>

<style type="text/scss">
  .main-container {
    // Inherit from Parent Svelte
    grid-area: main;
    height: 100%;
    
    // Divide areas
    display: grid;
    grid-template-rows: min-content 1fr 10fr;
    grid-template-areas:
      "alarm"
      "header"
      "content";
  }
  
  .alarm{
    grid-area: alarm;
    font-size: 1.2rem;
    
    &-content {
      padding: 1vh 1vw;
      background-color: var(--alarm-success);
      color: var(--main-font-color);
      font-weight: 600;

      transition: opacity 0.2s;
      
      i {
        padding-top: 0.5vh;
        float: right;
        cursor: pointer;
      }
    }
  }

  .header{
    // Inherit from Parent Class
    grid-area: header;
  
    // Divide areas
    display: grid;
    grid-template-rows: repeat(2, 0.5fr);
    grid-template-columns: repeat(2, 1fr);
    grid-template-areas: "title button" //1
      "item item"; //2

    &-title {
      // Inherit from Parent Class
      grid-area: title;
      padding: 1vh 1vw;

      &-name {
        font-size: 1.5rem;
        font-weight: 600;
      }
    }
  }
  
  .content{
    // Inherit from Parent Class
    grid-area: content;
    height: 100%;

    &-chart {
      margin: auto 1vw;
      height: 100%;
    }
  }
</style>
