<GameFile>
  <PropertyGroup Name="TaskView" Type="Layer" ID="5ba6fe97-f99f-4b14-8acf-e68e0fc5382f" Version="2.3.3.0" />
  <Content ctype="GameProjectContent">
    <Content>
      <Animation Duration="0" Speed="1.0000" />
      <ObjectData Name="Layer" Tag="333" ctype="GameLayerObjectData">
        <Size X="570.0000" Y="100.0000" />
        <Children>
          <AbstractNodeData Name="root" ActionTag="1643279602" Tag="337" IconVisible="False" TouchEnable="True" BackColorAlpha="102" ColorAngle="90.0000" Scale9Enable="True" LeftEage="13" RightEage="13" TopEage="13" BottomEage="13" Scale9OriginX="13" Scale9OriginY="13" Scale9Width="5" Scale9Height="6" ctype="PanelObjectData">
            <Size X="570.0000" Y="100.0000" />
            <Children>
              <AbstractNodeData Name="text" ActionTag="-404998371" Tag="338" IconVisible="False" LeftMargin="14.0299" RightMargin="155.9701" TopMargin="53.8353" BottomMargin="6.1647" IsCustomSize="True" FontSize="18" LabelText="这是一段&#xA;任务描述" VerticalAlignmentType="VT_Center" ShadowOffsetX="2.0000" ShadowOffsetY="-2.0000" ctype="TextObjectData">
                <Size X="400.0000" Y="40.0000" />
                <AnchorPoint />
                <Position X="14.0299" Y="6.1647" />
                <Scale ScaleX="1.0000" ScaleY="1.0000" />
                <CColor A="255" R="255" G="255" B="255" />
                <PrePosition X="0.0246" Y="0.0616" />
                <PreSize X="0.7018" Y="0.4000" />
                <OutlineColor A="255" R="255" G="0" B="0" />
                <ShadowColor A="255" R="110" G="110" B="110" />
              </AbstractNodeData>
              <AbstractNodeData Name="bar" ActionTag="1767600319" Tag="417" IconVisible="False" LeftMargin="35.6429" RightMargin="54.3571" TopMargin="3.5377" BottomMargin="46.4623" TouchEnable="True" BackColorAlpha="102" ColorAngle="90.0000" ctype="PanelObjectData">
                <Size X="480.0000" Y="50.0000" />
                <Children>
                  <AbstractNodeData Name="bg" ActionTag="-292391856" Tag="413" IconVisible="False" RightMargin="-320.0000" TopMargin="3.0000" Scale9Enable="True" LeftEage="135" RightEage="135" Scale9OriginX="135" Scale9Width="140" Scale9Height="47" ctype="ImageViewObjectData">
                    <Size X="800.0000" Y="47.0000" />
                    <AnchorPoint />
                    <Position />
                    <Scale ScaleX="0.6000" ScaleY="0.6000" />
                    <CColor A="255" R="255" G="255" B="255" />
                    <PrePosition />
                    <PreSize X="1.6667" Y="0.9400" />
                    <FileData Type="MarkedSubImage" Path="taskUI/bar02_bg.png" Plist="TaskUI.plist" />
                  </AbstractNodeData>
                  <AbstractNodeData Name="bar_blue" ActionTag="655791857" CallBackType="Click" Tag="416" IconVisible="False" LeftMargin="24.8586" RightMargin="25.1414" TopMargin="27.8402" BottomMargin="5.1598" ProgressInfo="100" ctype="LoadingBarObjectData">
                    <Size X="430.0000" Y="17.0000" />
                    <AnchorPoint ScaleX="0.5142" ScaleY="0.5128" />
                    <Position X="245.9859" Y="13.8774" />
                    <Scale ScaleX="1.0000" ScaleY="1.0000" />
                    <CColor A="255" R="255" G="255" B="255" />
                    <PrePosition X="0.5125" Y="0.2775" />
                    <PreSize X="0.8958" Y="0.3400" />
                    <ImageFileData Type="MarkedSubImage" Path="taskUI/bar02_blue.png" Plist="TaskUI.plist" />
                  </AbstractNodeData>
                  <AbstractNodeData Name="bar_purple" Visible="False" ActionTag="-758565160" CallBackType="Click" Tag="418" IconVisible="False" LeftMargin="24.8628" RightMargin="25.1372" TopMargin="27.8376" BottomMargin="5.1624" ProgressInfo="60" ctype="LoadingBarObjectData">
                    <Size X="430.0000" Y="17.0000" />
                    <AnchorPoint ScaleX="0.5142" ScaleY="0.5128" />
                    <Position X="245.9900" Y="13.8800" />
                    <Scale ScaleX="1.0000" ScaleY="1.0000" />
                    <CColor A="255" R="255" G="255" B="255" />
                    <PrePosition X="0.5125" Y="0.2776" />
                    <PreSize X="0.8958" Y="0.3400" />
                    <ImageFileData Type="MarkedSubImage" Path="taskUI/bar02_purple.png" Plist="TaskUI.plist" />
                  </AbstractNodeData>
                  <AbstractNodeData Name="title" ActionTag="-1171518904" Tag="414" IconVisible="False" LeftMargin="183.3908" RightMargin="173.6092" TopMargin="-13.6902" BottomMargin="1.6902" Scale9Width="123" Scale9Height="62" ctype="ImageViewObjectData">
                    <Size X="123.0000" Y="62.0000" />
                    <AnchorPoint ScaleX="0.5000" ScaleY="0.5000" />
                    <Position X="244.8908" Y="32.6902" />
                    <Scale ScaleX="0.8000" ScaleY="0.8000" />
                    <CColor A="255" R="255" G="255" B="255" />
                    <PrePosition X="0.5102" Y="0.6538" />
                    <PreSize X="0.2562" Y="1.2400" />
                    <FileData Type="MarkedSubImage" Path="taskUI/bar02_title.png" Plist="TaskUI.plist" />
                  </AbstractNodeData>
                  <AbstractNodeData Name="num" ActionTag="226149240" Tag="123" IconVisible="False" LeftMargin="228.8323" RightMargin="218.1677" TopMargin="6.5631" BottomMargin="25.4369" LabelText="99" ctype="TextBMFontObjectData">
                    <Size X="33.0000" Y="18.0000" />
                    <AnchorPoint ScaleX="0.5000" ScaleY="0.5000" />
                    <Position X="245.3323" Y="34.4369" />
                    <Scale ScaleX="1.0000" ScaleY="1.0000" />
                    <CColor A="255" R="81" G="251" B="53" />
                    <PrePosition X="0.5111" Y="0.6887" />
                    <PreSize X="0.0688" Y="0.3600" />
                    <LabelBMFontFile_CNB Type="Normal" Path="font/white14-export.fnt" Plist="" />
                  </AbstractNodeData>
                </Children>
                <AnchorPoint />
                <Position X="35.6429" Y="46.4623" />
                <Scale ScaleX="1.0000" ScaleY="1.0000" />
                <CColor A="255" R="255" G="255" B="255" />
                <PrePosition X="0.0625" Y="0.4646" />
                <PreSize X="0.8421" Y="0.5000" />
                <SingleColor A="255" R="150" G="200" B="255" />
                <FirstColor A="255" R="150" G="200" B="255" />
                <EndColor A="255" R="255" G="255" B="255" />
                <ColorVector ScaleY="1.0000" />
              </AbstractNodeData>
              <AbstractNodeData Name="btn" ActionTag="-1989171648" CallBackType="Click" Tag="413" IconVisible="False" LeftMargin="472.6727" RightMargin="7.3273" TopMargin="51.7141" BottomMargin="8.2859" TouchEnable="True" BackColorAlpha="102" ColorAngle="90.0000" Scale9Width="1" Scale9Height="1" ctype="PanelObjectData">
                <Size X="90.0000" Y="40.0000" />
                <Children>
                  <AbstractNodeData Name="buy_btn" ActionTag="-52323416" Tag="414" IconVisible="False" TouchEnable="True" FontSize="14" Scale9Enable="True" LeftEage="13" RightEage="13" TopEage="13" BottomEage="13" Scale9OriginX="13" Scale9OriginY="13" Scale9Width="6" Scale9Height="21" DisplayState="False" ShadowOffsetX="2.0000" ShadowOffsetY="-2.0000" ctype="ButtonObjectData">
                    <Size X="90.0000" Y="40.0000" />
                    <AnchorPoint />
                    <Position />
                    <Scale ScaleX="1.0000" ScaleY="1.0000" />
                    <CColor A="255" R="255" G="255" B="255" />
                    <PrePosition />
                    <PreSize X="1.0000" Y="1.0000" />
                    <TextColor A="255" R="65" G="65" B="70" />
                    <DisabledFileData Type="Normal" Path="mainUI/bg_14.png" Plist="" />
                    <PressedFileData Type="Normal" Path="mainUI/bg_14.png" Plist="" />
                    <NormalFileData Type="Normal" Path="mainUI/bg_14.png" Plist="" />
                    <OutlineColor A="255" R="255" G="0" B="0" />
                    <ShadowColor A="255" R="110" G="110" B="110" />
                  </AbstractNodeData>
                  <AbstractNodeData Name="buy_text" ActionTag="699656944" CallBackType="Click" Tag="415" IconVisible="False" LeftMargin="1.5000" RightMargin="1.5000" TopMargin="8.0000" BottomMargin="8.0000" Scale9Width="87" Scale9Height="24" ctype="ImageViewObjectData">
                    <Size X="87.0000" Y="24.0000" />
                    <AnchorPoint ScaleX="0.5000" ScaleY="0.5000" />
                    <Position X="45.0000" Y="20.0000" />
                    <Scale ScaleX="1.0000" ScaleY="1.0000" />
                    <CColor A="255" R="255" G="255" B="255" />
                    <PrePosition X="0.5000" Y="0.5000" />
                    <PreSize X="0.9667" Y="0.6000" />
                    <FileData Type="MarkedSubImage" Path="mailUI/get2.png" Plist="OtherUI.plist" />
                  </AbstractNodeData>
                </Children>
                <AnchorPoint />
                <Position X="472.6727" Y="8.2859" />
                <Scale ScaleX="1.0000" ScaleY="1.0000" />
                <CColor A="255" R="255" G="255" B="255" />
                <PrePosition X="0.8293" Y="0.0829" />
                <PreSize X="0.1579" Y="0.4000" />
                <SingleColor A="255" R="150" G="200" B="255" />
                <FirstColor A="255" R="150" G="200" B="255" />
                <EndColor A="255" R="255" G="255" B="255" />
                <ColorVector ScaleY="1.0000" />
              </AbstractNodeData>
              <AbstractNodeData Name="get" Visible="False" ActionTag="-1519562434" Tag="335" IconVisible="False" LeftMargin="484.1097" RightMargin="7.8903" TopMargin="9.8064" BottomMargin="13.1936" ctype="SpriteObjectData">
                <Size X="78.0000" Y="77.0000" />
                <AnchorPoint ScaleX="0.5000" ScaleY="0.5000" />
                <Position X="523.1097" Y="51.6936" />
                <Scale ScaleX="1.0000" ScaleY="1.0000" />
                <CColor A="255" R="255" G="255" B="255" />
                <PrePosition X="0.9177" Y="0.5169" />
                <PreSize X="0.1368" Y="0.7700" />
                <FileData Type="MarkedSubImage" Path="taskUI/get.png" Plist="TaskUI.plist" />
                <BlendFunc Src="770" Dst="771" />
              </AbstractNodeData>
            </Children>
            <AnchorPoint />
            <Position />
            <Scale ScaleX="1.0000" ScaleY="1.0000" />
            <CColor A="255" R="255" G="255" B="255" />
            <PrePosition />
            <PreSize X="1.0000" Y="1.0000" />
            <FileData Type="Normal" Path="mainUI/bg_05.png" Plist="" />
            <SingleColor A="255" R="150" G="200" B="255" />
            <FirstColor A="255" R="150" G="200" B="255" />
            <EndColor A="255" R="255" G="255" B="255" />
            <ColorVector ScaleY="1.0000" />
          </AbstractNodeData>
        </Children>
      </ObjectData>
    </Content>
  </Content>
</GameFile>