$(document).ready(function () {
  // Native buttons also support keyboard activation.
  $(".links button[aria-controls]").click(function () {
    const entry = $(this).parent().parent();
    const panel = document.getElementById(this.getAttribute("aria-controls"));
    const expanded = this.getAttribute("aria-expanded") !== "true";
    entry.find(".hidden.open").removeClass("open").attr("aria-hidden", "true");
    entry.find("button[aria-controls]").attr("aria-expanded", "false");
    if (panel && expanded) {
      $(panel).addClass("open").attr("aria-hidden", "false");
      this.setAttribute("aria-expanded", "true");
    }
  });
  $("a").removeClass("waves-effect waves-light");

  // bootstrap-toc
  if ($("#toc-sidebar").length) {
    // remove related publications years from the TOC
    $(".publications h2").each(function () {
      $(this).attr("data-toc-skip", "");
    });
    var navSelector = "#toc-sidebar";
    var $myNav = $(navSelector);
    Toc.init($myNav);
    $("body").scrollspy({
      target: navSelector,
    });
  }

  // add css to jupyter notebooks
  const cssLink = document.createElement("link");
  cssLink.href = "../css/jupyter.css";
  cssLink.rel = "stylesheet";
  cssLink.type = "text/css";

  let jupyterTheme = determineComputedTheme();

  $(".jupyter-notebook-iframe-container iframe").each(function () {
    $(this).contents().find("head").append(cssLink);

    if (jupyterTheme == "dark") {
      $(this).bind("load", function () {
        $(this).contents().find("body").attr({
          "data-jp-theme-light": "false",
          "data-jp-theme-name": "JupyterLab Dark",
        });
      });
    }
  });

  // trigger popovers
  $('[data-toggle="popover"]').popover({
    trigger: "hover",
  });
});
