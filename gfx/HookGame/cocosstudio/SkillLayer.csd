<GameFile>
  <PropertyGroup Name="SkillLayer" Type="Layer" ID="2e40f9b8-670c-432b-b0f9-79603f2332cf" Version="2.3.3.0" />
  <Content ctype="GameProjectContent">
    <Content>
      <Animation Duration="0" Speed="1.0000">
        <Timeline ActionTag="-1452498293" Property="Position">
          <PointFrame FrameIndex="0" X="10.9998" Y="7.9998">
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
        <Size X="640.0000" Y="250.0000" />
        <Children>
          <AbstractNodeData Name="root" ActionTag="-1011955371" Tag="508" IconVisible="False" TouchEnable="True" BackColorAlpha="102" ColorAngle="90.0000" Scale9Width="1" Scale9Height="1" ctype="PanelObjectData">
            <Size X="640.0000" Y="250.0000" />
            <Children>
              <AbstractNodeData Name="skillLayer_bg" ActionTag="1030660432" Tag="261" IconVisible="False" Scale9Enable="True" LeftEage="22" RightEage="22" TopEage="22" BottomEage="22" Scale9OriginX="22" Scale9OriginY="22" Scale9Width="34" Scale9Height="34" ctype="ImageViewObjectData">
                <Size X="640.0000" Y="250.0000" />
                <AnchorPoint />
                <Position />
                <Scale ScaleX="1.0000" ScaleY="1.0000" />
                <CColor A="255" R="255" G="255" B="255" />
                <PrePosition />
                <PreSize X="1.0000" Y="1.0000" />
                <FileData Type="Normal" Path="ui/bg_03.png" Plist="" />
              </AbstractNodeData>
              <AbstractNodeData Name="atk_text" ActionTag="-1025331302" Tag="260" IconVisible="False" LeftMargin="90.2951" RightMargin="479.7049" TopMargin="9.6425" BottomMargin="220.3575" FontSize="20" LabelText="9999999" ShadowOffsetX="2.0000" ShadowOffsetY="-2.0000" ctype="TextObjectData">
                <Size X="70.0000" Y="20.0000" />
                <AnchorPoint ScaleX="0.5000" ScaleY="0.5000" />
                <Position X="125.2951" Y="230.3575" />
                <Scale ScaleX="1.0000" ScaleY="1.0000" />
                <CColor A="255" R="0" G="0" B="0" />
                <PrePosition X="0.1958" Y="0.9214" />
                <PreSize X="0.1094" Y="0.0800" />
                <OutlineColor A="255" R="255" G="0" B="0" />
                <ShadowColor A="255" R="110" G="110" B="110" />
              </AbstractNodeData>
              <AbstractNodeData Name="tatk_text" ActionTag="-877663703" Tag="259" IconVisible="False" LeftMargin="557.3304" RightMargin="12.6696" TopMargin="9.6425" BottomMargin="220.3575" FontSize="20" LabelText="9999999" ShadowOffsetX="2.0000" ShadowOffsetY="-2.0000" ctype="TextObjectData">
                <Size X="70.0000" Y="20.0000" />
                <AnchorPoint ScaleX="0.5000" ScaleY="0.5000" />
                <Position X="592.3304" Y="230.3575" />
                <Scale ScaleX="1.0000" ScaleY="1.0000" />
                <CColor A="255" R="0" G="0" B="0" />
                <PrePosition X="0.9255" Y="0.9214" />
                <PreSize X="0.1094" Y="0.0800" />
                <OutlineColor A="255" R="255" G="0" B="0" />
                <ShadowColor A="255" R="110" G="110" B="110" />
              </AbstractNodeData>
              <AbstractNodeData Name="atk" ActionTag="-1831883598" Tag="258" IconVisible="False" LeftMargin="9.5628" RightMargin="540.4372" TopMargin="8.6422" BottomMargin="221.3578" FontSize="20" LabelText="英雄DPS：" ShadowOffsetX="2.0000" ShadowOffsetY="-2.0000" ctype="TextObjectData">
                <Size X="90.0000" Y="20.0000" />
                <AnchorPoint ScaleX="0.5000" ScaleY="0.5000" />
                <Position X="54.5628" Y="231.3578" />
                <Scale ScaleX="1.0000" ScaleY="1.0000" />
                <CColor A="255" R="0" G="0" B="0" />
                <PrePosition X="0.0853" Y="0.9254" />
                <PreSize X="0.1406" Y="0.0800" />
                <OutlineColor A="255" R="255" G="0" B="0" />
                <ShadowColor A="255" R="110" G="110" B="110" />
              </AbstractNodeData>
              <AbstractNodeData Name="tatk" ActionTag="1479834740" Tag="257" IconVisible="False" LeftMargin="446.3264" RightMargin="73.6736" TopMargin="8.6422" BottomMargin="221.3578" FontSize="20" LabelText="点击攻击力：" ShadowOffsetX="2.0000" ShadowOffsetY="-2.0000" ctype="TextObjectData">
                <Size X="120.0000" Y="20.0000" />
                <AnchorPoint ScaleX="0.5000" ScaleY="0.5000" />
                <Position X="506.3264" Y="231.3578" />
                <Scale ScaleX="1.0000" ScaleY="1.0000" />
                <CColor A="255" R="0" G="0" B="0" />
                <PrePosition X="0.7911" Y="0.9254" />
                <PreSize X="0.1875" Y="0.0800" />
                <OutlineColor A="255" R="255" G="0" B="0" />
                <ShadowColor A="255" R="110" G="110" B="110" />
              </AbstractNodeData>
              <AbstractNodeData Name="skill7" ActionTag="1771128983" Tag="241" IconVisible="True" LeftMargin="534.0000" RightMargin="11.0000" TopMargin="147.0002" BottomMargin="7.9998" StretchWidthEnable="False" StretchHeightEnable="False" InnerActionSpeed="1.0000" CustomSizeEnabled="False" ctype="ProjectNodeObjectData">
                <Size X="95.0000" Y="95.0000" />
                <AnchorPoint />
                <Position X="534.0000" Y="7.9998" />
                <Scale ScaleX="1.0000" ScaleY="1.0000" />
                <CColor A="255" R="255" G="255" B="255" />
                <PrePosition X="0.8344" Y="0.0320" />
                <PreSize X="0.1484" Y="0.3800" />
                <FileData Type="Normal" Path="Skillicon.csd" Plist="" />
              </AbstractNodeData>
              <AbstractNodeData Name="skill6" ActionTag="1873054001" Tag="235" IconVisible="True" LeftMargin="446.4988" RightMargin="98.5012" TopMargin="60.0031" BottomMargin="94.9969" StretchWidthEnable="False" StretchHeightEnable="False" InnerActionSpeed="1.0000" CustomSizeEnabled="False" ctype="ProjectNodeObjectData">
                <Size X="95.0000" Y="95.0000" />
                <AnchorPoint />
                <Position X="446.4988" Y="94.9969" />
                <Scale ScaleX="1.0000" ScaleY="1.0000" />
                <CColor A="255" R="255" G="255" B="255" />
                <PrePosition X="0.6977" Y="0.3800" />
                <PreSize X="0.1484" Y="0.3800" />
                <FileData Type="Normal" Path="Skillicon.csd" Plist="" />
              </AbstractNodeData>
              <AbstractNodeData Name="skill5" ActionTag="420806031" Tag="229" IconVisible="True" LeftMargin="359.6666" RightMargin="185.3334" TopMargin="147.0002" BottomMargin="7.9998" StretchWidthEnable="False" StretchHeightEnable="False" InnerActionSpeed="1.0000" CustomSizeEnabled="False" ctype="ProjectNodeObjectData">
                <Size X="95.0000" Y="95.0000" />
                <AnchorPoint />
                <Position X="359.6666" Y="7.9998" />
                <Scale ScaleX="1.0000" ScaleY="1.0000" />
                <CColor A="255" R="255" G="255" B="255" />
                <PrePosition X="0.5620" Y="0.0320" />
                <PreSize X="0.1484" Y="0.3800" />
                <FileData Type="Normal" Path="Skillicon.csd" Plist="" />
              </AbstractNodeData>
              <AbstractNodeData Name="skill4" ActionTag="1903387533" Tag="223" IconVisible="True" LeftMargin="272.5012" RightMargin="272.4988" TopMargin="60.0036" BottomMargin="94.9964" StretchWidthEnable="False" StretchHeightEnable="False" InnerActionSpeed="1.0000" CustomSizeEnabled="False" ctype="ProjectNodeObjectData">
                <Size X="95.0000" Y="95.0000" />
                <AnchorPoint />
                <Position X="272.5012" Y="94.9964" />
                <Scale ScaleX="1.0000" ScaleY="1.0000" />
                <CColor A="255" R="255" G="255" B="255" />
                <PrePosition X="0.4258" Y="0.3800" />
                <PreSize X="0.1484" Y="0.3800" />
                <FileData Type="Normal" Path="Skillicon.csd" Plist="" />
              </AbstractNodeData>
              <AbstractNodeData Name="skill3" ActionTag="1685468251" Tag="217" IconVisible="True" LeftMargin="185.3332" RightMargin="359.6668" TopMargin="147.0002" BottomMargin="7.9998" StretchWidthEnable="False" StretchHeightEnable="False" InnerActionSpeed="1.0000" CustomSizeEnabled="False" ctype="ProjectNodeObjectData">
                <Size X="95.0000" Y="95.0000" />
                <AnchorPoint />
                <Position X="185.3332" Y="7.9998" />
                <Scale ScaleX="1.0000" ScaleY="1.0000" />
                <CColor A="255" R="255" G="255" B="255" />
                <PrePosition X="0.2896" Y="0.0320" />
                <PreSize X="0.1484" Y="0.3800" />
                <FileData Type="Normal" Path="Skillicon.csd" Plist="" />
              </AbstractNodeData>
              <AbstractNodeData Name="skill2" ActionTag="277690000" Tag="211" IconVisible="True" LeftMargin="98.5002" RightMargin="446.4998" TopMargin="60.0033" BottomMargin="94.9967" StretchWidthEnable="False" StretchHeightEnable="False" InnerActionSpeed="1.0000" CustomSizeEnabled="False" ctype="ProjectNodeObjectData">
                <Size X="95.0000" Y="95.0000" />
                <AnchorPoint />
                <Position X="98.5002" Y="94.9967" />
                <Scale ScaleX="1.0000" ScaleY="1.0000" />
                <CColor A="255" R="255" G="255" B="255" />
                <PrePosition X="0.1539" Y="0.3800" />
                <PreSize X="0.1484" Y="0.3800" />
                <FileData Type="Normal" Path="Skillicon.csd" Plist="" />
              </AbstractNodeData>
              <AbstractNodeData Name="skill1" ActionTag="-1452498293" Tag="205" IconVisible="True" LeftMargin="10.9998" RightMargin="534.0002" TopMargin="147.0002" BottomMargin="7.9998" StretchWidthEnable="False" StretchHeightEnable="False" InnerActionSpeed="1.0000" CustomSizeEnabled="False" ctype="ProjectNodeObjectData">
                <Size X="95.0000" Y="95.0000" />
                <AnchorPoint />
                <Position X="10.9998" Y="7.9998" />
                <Scale ScaleX="1.0000" ScaleY="1.0000" />
                <CColor A="255" R="255" G="255" B="255" />
                <PrePosition X="0.0172" Y="0.0320" />
                <PreSize X="0.1484" Y="0.3800" />
                <FileData Type="Normal" Path="Skillicon.csd" Plist="" />
              </AbstractNodeData>
              <AbstractNodeData Name="goldLayer" ActionTag="-1689348075" Tag="165" IconVisible="True" LeftMargin="228.7035" RightMargin="231.2965" TopMargin="-50.2975" BottomMargin="250.2975" StretchWidthEnable="False" StretchHeightEnable="False" InnerActionSpeed="1.0000" CustomSizeEnabled="False" ctype="ProjectNodeObjectData">
                <Size X="180.0000" Y="50.0000" />
                <AnchorPoint />
                <Position X="228.7035" Y="250.2975" />
                <Scale ScaleX="1.0000" ScaleY="1.0000" />
                <CColor A="255" R="255" G="255" B="255" />
                <PrePosition X="0.3573" Y="1.0012" />
                <PreSize X="0.2813" Y="0.2000" />
                <FileData Type="Normal" Path="GoldLayer.csd" Plist="" />
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