<GameFile>
  <PropertyGroup Name="SkillLayer" Type="Layer" ID="2e40f9b8-670c-432b-b0f9-79603f2332cf" Version="2.3.3.0" />
  <Content ctype="GameProjectContent">
    <Content>
      <Animation Duration="0" Speed="1.0000">
        <Timeline ActionTag="-1452498293" Property="Position">
          <PointFrame FrameIndex="0" X="10.9997" Y="12.9998">
            <EasingData Type="0" />
          </PointFrame>
        </Timeline>
        <Timeline ActionTag="-1452498293" Property="ActionValue">
          <InnerActionFrame FrameIndex="0" Tween="False" InnerActionType="SingleFrame" CurrentAniamtionName="-- ALL --" SingleFrameIndex="0" />
        </Timeline>
        <Timeline ActionTag="-1452498293" Property="Scale">
          <ScaleFrame FrameIndex="0" X="1.0000" Y="1.0000">
            <EasingData Type="0" />
          </ScaleFrame>
        </Timeline>
        <Timeline ActionTag="-1452498293" Property="RotationSkew">
          <ScaleFrame FrameIndex="0" X="0.0000" Y="0.0000">
            <EasingData Type="0" />
          </ScaleFrame>
        </Timeline>
      </Animation>
      <ObjectData Name="Layer" Tag="204" ctype="GameLayerObjectData">
        <Size X="640.0000" Y="240.0000" />
        <Children>
          <AbstractNodeData Name="root" ActionTag="-1011955371" Tag="508" IconVisible="False" TouchEnable="True" BackColorAlpha="102" ColorAngle="90.0000" Scale9Width="1" Scale9Height="1" ctype="PanelObjectData">
            <Size X="640.0000" Y="240.0000" />
            <Children>
              <AbstractNodeData Name="skillLayer_bg" ActionTag="1030660432" Tag="261" IconVisible="False" Scale9Enable="True" LeftEage="12" RightEage="12" TopEage="12" BottomEage="12" Scale9OriginX="12" Scale9OriginY="12" Scale9Width="7" Scale9Height="8" ctype="ImageViewObjectData">
                <Size X="640.0000" Y="240.0000" />
                <AnchorPoint />
                <Position />
                <Scale ScaleX="1.0000" ScaleY="1.0000" />
                <CColor A="255" R="255" G="255" B="255" />
                <PrePosition />
                <PreSize X="1.0000" Y="1.0000" />
                <FileData Type="Normal" Path="mainUI/bg_04.png" Plist="" />
              </AbstractNodeData>
              <AbstractNodeData Name="atk" ActionTag="-966206276" CallBackType="Click" Tag="170" IconVisible="False" LeftMargin="12.7592" RightMargin="496.2408" TopMargin="7.0950" BottomMargin="205.9050" Scale9Width="131" Scale9Height="27" ctype="ImageViewObjectData">
                <Size X="131.0000" Y="27.0000" />
                <AnchorPoint />
                <Position X="12.7592" Y="205.9050" />
                <Scale ScaleX="1.0000" ScaleY="1.0000" />
                <CColor A="255" R="255" G="255" B="255" />
                <PrePosition X="0.0199" Y="0.8579" />
                <PreSize X="0.2047" Y="0.1125" />
                <FileData Type="Normal" Path="skillUI/hero.png" Plist="" />
              </AbstractNodeData>
              <AbstractNodeData Name="atk_text" ActionTag="-1087542958" Tag="171" IconVisible="False" LeftMargin="139.2657" RightMargin="374.7343" TopMargin="12.0950" BottomMargin="210.9050" CharWidth="18" CharHeight="17" LabelText="1231321" StartChar="0" ctype="TextAtlasObjectData">
                <Size X="126.0000" Y="17.0000" />
                <AnchorPoint />
                <Position X="139.2657" Y="210.9050" />
                <Scale ScaleX="1.0000" ScaleY="1.0000" />
                <CColor A="255" R="255" G="255" B="255" />
                <PrePosition X="0.2176" Y="0.8788" />
                <PreSize X="0.1969" Y="0.0708" />
                <LabelAtlasFileImage_CNB Type="Normal" Path="mainUI/font22_white.png" Plist="" />
              </AbstractNodeData>
              <AbstractNodeData Name="tatk" ActionTag="1563928514" Tag="173" IconVisible="False" LeftMargin="409.6177" RightMargin="99.3823" TopMargin="7.5950" BottomMargin="206.4050" Scale9Width="131" Scale9Height="26" ctype="ImageViewObjectData">
                <Size X="131.0000" Y="26.0000" />
                <AnchorPoint />
                <Position X="409.6177" Y="206.4050" />
                <Scale ScaleX="1.0000" ScaleY="1.0000" />
                <CColor A="255" R="255" G="255" B="255" />
                <PrePosition X="0.6400" Y="0.8600" />
                <PreSize X="0.2047" Y="0.1083" />
                <FileData Type="Normal" Path="skillUI/tap.png" Plist="" />
              </AbstractNodeData>
              <AbstractNodeData Name="tatk_text" ActionTag="309744497" Tag="172" IconVisible="False" LeftMargin="536.2065" RightMargin="13.7935" TopMargin="12.0950" BottomMargin="210.9050" CharWidth="18" CharHeight="17" LabelText="12313" StartChar="0" ctype="TextAtlasObjectData">
                <Size X="90.0000" Y="17.0000" />
                <AnchorPoint />
                <Position X="536.2065" Y="210.9050" />
                <Scale ScaleX="1.0000" ScaleY="1.0000" />
                <CColor A="255" R="255" G="255" B="255" />
                <PrePosition X="0.8378" Y="0.8788" />
                <PreSize X="0.1406" Y="0.0708" />
                <LabelAtlasFileImage_CNB Type="Normal" Path="mainUI/font22_white.png" Plist="" />
              </AbstractNodeData>
              <AbstractNodeData Name="skill7" ActionTag="1771128983" Tag="241" IconVisible="True" LeftMargin="533.9998" RightMargin="11.0002" TopMargin="132.0002" BottomMargin="12.9998" StretchWidthEnable="False" StretchHeightEnable="False" InnerActionSpeed="1.0000" CustomSizeEnabled="False" ctype="ProjectNodeObjectData">
                <Size X="95.0000" Y="95.0000" />
                <AnchorPoint />
                <Position X="533.9998" Y="12.9998" />
                <Scale ScaleX="1.0000" ScaleY="1.0000" />
                <CColor A="255" R="255" G="255" B="255" />
                <PrePosition X="0.8344" Y="0.0542" />
                <PreSize X="0.1484" Y="0.3958" />
                <FileData Type="Normal" Path="Skillicon.csd" Plist="" />
              </AbstractNodeData>
              <AbstractNodeData Name="skill6" ActionTag="1873054001" Tag="235" IconVisible="True" LeftMargin="446.4987" RightMargin="98.5013" TopMargin="45.0034" BottomMargin="99.9966" StretchWidthEnable="False" StretchHeightEnable="False" InnerActionSpeed="1.0000" CustomSizeEnabled="False" ctype="ProjectNodeObjectData">
                <Size X="95.0000" Y="95.0000" />
                <AnchorPoint />
                <Position X="446.4987" Y="99.9966" />
                <Scale ScaleX="1.0000" ScaleY="1.0000" />
                <CColor A="255" R="255" G="255" B="255" />
                <PrePosition X="0.6977" Y="0.4167" />
                <PreSize X="0.1484" Y="0.3958" />
                <FileData Type="Normal" Path="Skillicon.csd" Plist="" />
              </AbstractNodeData>
              <AbstractNodeData Name="skill5" ActionTag="420806031" Tag="229" IconVisible="True" LeftMargin="359.6664" RightMargin="185.3336" TopMargin="132.0002" BottomMargin="12.9998" StretchWidthEnable="False" StretchHeightEnable="False" InnerActionSpeed="1.0000" CustomSizeEnabled="False" ctype="ProjectNodeObjectData">
                <Size X="95.0000" Y="95.0000" />
                <AnchorPoint />
                <Position X="359.6664" Y="12.9998" />
                <Scale ScaleX="1.0000" ScaleY="1.0000" />
                <CColor A="255" R="255" G="255" B="255" />
                <PrePosition X="0.5620" Y="0.0542" />
                <PreSize X="0.1484" Y="0.3958" />
                <FileData Type="Normal" Path="Skillicon.csd" Plist="" />
              </AbstractNodeData>
              <AbstractNodeData Name="skill4" ActionTag="1903387533" Tag="223" IconVisible="True" LeftMargin="272.5012" RightMargin="272.4988" TopMargin="45.0037" BottomMargin="99.9963" StretchWidthEnable="False" StretchHeightEnable="False" InnerActionSpeed="1.0000" CustomSizeEnabled="False" ctype="ProjectNodeObjectData">
                <Size X="95.0000" Y="95.0000" />
                <AnchorPoint />
                <Position X="272.5012" Y="99.9963" />
                <Scale ScaleX="1.0000" ScaleY="1.0000" />
                <CColor A="255" R="255" G="255" B="255" />
                <PrePosition X="0.4258" Y="0.4167" />
                <PreSize X="0.1484" Y="0.3958" />
                <FileData Type="Normal" Path="Skillicon.csd" Plist="" />
              </AbstractNodeData>
              <AbstractNodeData Name="skill3" ActionTag="1685468251" Tag="217" IconVisible="True" LeftMargin="185.3333" RightMargin="359.6667" TopMargin="132.0002" BottomMargin="12.9998" StretchWidthEnable="False" StretchHeightEnable="False" InnerActionSpeed="1.0000" CustomSizeEnabled="False" ctype="ProjectNodeObjectData">
                <Size X="95.0000" Y="95.0000" />
                <AnchorPoint />
                <Position X="185.3333" Y="12.9998" />
                <Scale ScaleX="1.0000" ScaleY="1.0000" />
                <CColor A="255" R="255" G="255" B="255" />
                <PrePosition X="0.2896" Y="0.0542" />
                <PreSize X="0.1484" Y="0.3958" />
                <FileData Type="Normal" Path="Skillicon.csd" Plist="" />
              </AbstractNodeData>
              <AbstractNodeData Name="skill2" ActionTag="277690000" Tag="211" IconVisible="True" LeftMargin="98.5000" RightMargin="446.5000" TopMargin="45.0034" BottomMargin="99.9966" StretchWidthEnable="False" StretchHeightEnable="False" InnerActionSpeed="1.0000" CustomSizeEnabled="False" ctype="ProjectNodeObjectData">
                <Size X="95.0000" Y="95.0000" />
                <AnchorPoint />
                <Position X="98.5000" Y="99.9966" />
                <Scale ScaleX="1.0000" ScaleY="1.0000" />
                <CColor A="255" R="255" G="255" B="255" />
                <PrePosition X="0.1539" Y="0.4167" />
                <PreSize X="0.1484" Y="0.3958" />
                <FileData Type="Normal" Path="Skillicon.csd" Plist="" />
              </AbstractNodeData>
              <AbstractNodeData Name="skill1" ActionTag="-1452498293" Tag="205" IconVisible="True" LeftMargin="10.9997" RightMargin="534.0003" TopMargin="132.0002" BottomMargin="12.9998" StretchWidthEnable="False" StretchHeightEnable="False" InnerActionSpeed="1.0000" CustomSizeEnabled="False" ctype="ProjectNodeObjectData">
                <Size X="95.0000" Y="95.0000" />
                <AnchorPoint />
                <Position X="10.9997" Y="12.9998" />
                <Scale ScaleX="1.0000" ScaleY="1.0000" />
                <CColor A="255" R="255" G="255" B="255" />
                <PrePosition X="0.0172" Y="0.0542" />
                <PreSize X="0.1484" Y="0.3958" />
                <FileData Type="Normal" Path="Skillicon.csd" Plist="" />
              </AbstractNodeData>
            </Children>
            <AnchorPoint />
            <Position />
            <Scale ScaleX="1.0000" ScaleY="1.0000" />
            <CColor A="255" R="255" G="255" B="255" />
            <PrePosition />
            <PreSize X="1.0000" Y="1.0000" />
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