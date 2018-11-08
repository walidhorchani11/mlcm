
	/* Resize flow diagram */
	var flowDiagramContainer = document.getElementById("clm_flow_diagram_presentations"),
	flowDiagramContainerCSSWidth = parseInt(window.getComputedStyle(flowDiagramContainer).width) - (parseInt(window.getComputedStyle(flowDiagramContainer).paddingRight) + parseInt(window.getComputedStyle(flowDiagramContainer).paddingLeft)),
	flowDiagramContainerCSSHeight = parseInt(window.getComputedStyle(flowDiagramContainer).height) - (parseInt(window.getComputedStyle(flowDiagramContainer).paddingTop) + parseInt(window.getComputedStyle(flowDiagramContainer).paddingBottom)),
	flowDiagramContainerWidthCoefficient,
	flowDiagramContainerHeightCoefficient,
	flowDiagramContainerAUTOWidth = 0,
	flowDiagramContainerAUTOHeight,
	flowDiagramBodyWidth,
	flowDiagramTranslateX;

	flowDiagramContainer.style.height = "auto";

	var menuFlowDiagramItems = document.getElementsByClassName("pull-left");
	for(var i = 0; i < menuFlowDiagramItems.length; i++){
		flowDiagramContainerAUTOWidth += menuFlowDiagramItems[i].offsetWidth;
	}
	//console.log("flowDiagramContainerAUTOWidth: " + flowDiagramContainerAUTOWidth);
	flowDiagramContainer.style.width = (flowDiagramContainerAUTOWidth + parseInt(window.getComputedStyle(flowDiagramContainer).paddingRight) + parseInt(window.getComputedStyle(flowDiagramContainer).paddingLeft)) + "px";
	
	flowDiagramContainerAUTOHeight = flowDiagramContainer.offsetHeight;
	flowDiagramContainerWidthCoefficient = flowDiagramContainerCSSWidth / (flowDiagramContainerAUTOWidth + parseInt(window.getComputedStyle(flowDiagramContainer).paddingRight) + parseInt(window.getComputedStyle(flowDiagramContainer).paddingLeft));
	flowDiagramContainerHeightCoefficient = flowDiagramContainerCSSHeight / flowDiagramContainerAUTOHeight
	//console.log("flowDiagramContainerWidthCoefficient: " + flowDiagramContainerWidthCoefficient + " / flowDiagramContainerHeightCoefficient: " + flowDiagramContainerHeightCoefficient);

	if(flowDiagramContainerWidthCoefficient < 1 || flowDiagramContainerHeightCoefficient < 1){
		flowDiagramBodyWidth = parseInt(window.getComputedStyle(document.getElementsByTagName("body")[0]).width);
		flowDiagramTranslateX = ((flowDiagramBodyWidth - flowDiagramContainerCSSWidth) / 2) * (1 / flowDiagramContainerWidthCoefficient);

		//console.log(flowDiagramContainerCSSWidth + " / " + flowDiagramBodyWidth + " / " + flowDiagramTranslateX);

		if(flowDiagramContainerHeightCoefficient < flowDiagramContainerWidthCoefficient){
			flowDiagramContainer.style.zoom = flowDiagramContainerHeightCoefficient;
		}
		else{
			flowDiagramContainer.style.zoom = flowDiagramContainerWidthCoefficient;
		}
	}
	else{
		flowDiagramContainer.style.width = flowDiagramContainerCSSWidth + "px";
		flowDiagramContainer.style.height = flowDiagramContainerCSSHeight + "px";
	}
	//document.getElementById("clm_flow_diagram_presentations").innerHTML += "<span style='font-size: 90px;'>My text 6</span>";
