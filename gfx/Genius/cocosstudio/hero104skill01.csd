<GameFile>
  <PropertyGroup Name="hero104skill01" Type="Node" ID="1fa897cf-3bd5-46d9-a49b-8524119afca9" Version="2.3.3.0" />
  <Content ctype="GameProjectContent">
    <Content>
      <Animation Duration="30" Speed="0.3333">
        <Timeline ActionTag="-1288507784" Property="Position">
          <PointFrame FrameIndex="0" X="0.0000" Y="0.0000">
            <EasingData Type="0" />
          </PointFrame>
          <PointFrame FrameIndex="30" X="0.0000" Y="0.0000">
            <EasingData Type="0" />
          </PointFrame>
        </Timeline>
        <Timeline ActionTag="-1288507784" Property="CColor">
          <ColorFrame FrameIndex="0" Alpha="255">
            <EasingData Type="0" />
            <Color A="255" R="0" G="0" B="0" />
          </ColorFrame>
          <ColorFrame FrameIndex="30" Alpha="255">
            <EasingData Type="0" />
            <Color A="255" R="0" G="0" B="0" />
          </ColorFrame>
        </Timeline>
        <Timeline ActionTag="-1288507784" Property="Alpha">
          <IntFrame FrameIndex="0" Value="204">
            <EasingData Type="0" />
          </IntFrame>
          <IntFrame FrameIndex="30" Value="204">
            <EasingData Type="0" />
          </IntFrame>
        </Timeline>
        <Timeline ActionTag="-1288507784" Property="AnchorPoint">
          <ScaleFrame FrameIndex="0" X="0.5000" Y="0.0000">
            <EasingData Type="0" />
          </ScaleFrame>
          <ScaleFrame FrameIndex="30" X="0.5000" Y="0.0000">
            <EasingData Type="0" />
          </ScaleFrame>
        </Timeline>
        <Timeline ActionTag="-1396215919" Property="FileData">
          <TextureFrame FrameIndex="0" Tween="False">
            <TextureFile Type="Normal" Path="hero104skill01/fly01.png" Plist="" />
          </TextureFrame>
          <TextureFrame FrameIndex="2" Tween="False">
            <TextureFile Type="Normal" Path="hero104skill01/fly02.png" Plist="" />
          </TextureFrame>
          <TextureFrame FrameIndex="4" Tween="False">
            <TextureFile Type="Normal" Path="hero104skill01/fly03.png" Plist="" />
          </TextureFrame>
          <TextureFrame FrameIndex="6" Tween="False">
            <TextureFile Type="Normal" Path="hero104skill01/fly04.png" Plist="" />
          </TextureFrame>
          <TextureFrame FrameIndex="8" Tween="False">
            <TextureFile Type="Normal" Path="hero104skill01/fly05.png" Plist="" />
          </TextureFrame>
          <TextureFrame FrameIndex="10" Tween="False">
            <TextureFile Type="Normal" Path="hero104skill01/fly06.png" Plist="" />
          </TextureFrame>
          <TextureFrame FrameIndex="12" Tween="False">
            <TextureFile Type="Normal" Path="hero104skill01/fly07.png" Plist="" />
          </TextureFrame>
          <TextureFrame FrameIndex="14" Tween="False">
            <TextureFile Type="Normal" Path="hero104skill01/fly08.png" Plist="" />
          </TextureFrame>
          <TextureFrame FrameIndex="16" Tween="False">
            <TextureFile Type="Normal" Path="hero104skill01/fly09.png" Plist="" />
          </TextureFrame>
          <TextureFrame FrameIndex="18" Tween="False">
            <TextureFile Type="Normal" Path="hero104skill01/fly10.png" Plist="" />
          </TextureFrame>
        </Timeline>
        <Timeline ActionTag="-1427202678" Property="FileData">
          <TextureFrame FrameIndex="5" Tween="False">
            <TextureFile Type="Normal" Path="hero104skill01/hero01.png" Plist="" />
          </TextureFrame>
          <TextureFrame FrameIndex="7" Tween="False">
            <TextureFile Type="Normal" Path="hero104skill01/hero02.png" Plist="" />
          </TextureFrame>
          <TextureFrame FrameIndex="9" Tween="False">
            <TextureFile Type="Normal" Path="hero104skill01/hero03.png" Plist="" />
          </TextureFrame>
          <TextureFrame FrameIndex="11" Tween="False">
            <TextureFile Type="Normal" Path="hero104skill01/hero04.png" Plist="" />
          </TextureFrame>
          <TextureFrame FrameIndex="13" Tween="False">
            <TextureFile Type="Normal" Path="hero104skill01/hero05.png" Plist="" />
          </TextureFrame>
        </Timeline>
      </Animation>
      <ObjectData Name="Node" Tag="25" ctype="GameNodeObjectData">
        <Size X="0.0000" Y="0.0000" />
        <Children>
          <AbstractNodeData Name="bg" ActionTag="-1288507784" Alpha="204" Tag="26" IconVisible="False" LeftMargin="-320.0000" RightMargin="-320.0000" TopMargin="-500.0000" TouchEnable="True" BackColorAlpha="102" ComboBoxIndex="1" ColorAngle="90.0000" Scale9Width="640" Scale9Height="500" ctype="PanelObjectData">
            <Size X="640.0000" Y="500.0000" />
            <AnchorPoint ScaleX="0.5000" />
            <Position />
            <Scale ScaleX="1.0000" ScaleY="1.0000" />
            <CColor A="255" R="0" G="0" B="0" />
            <PrePosition />
            <PreSize X="0.0000" Y="0.0000" />
            <FileData Type="Normal" Path="shine/bg.png" Plist="" />
            <SingleColor A="255" R="150" G="200" B="255" />
            <FirstColor A="255" R="150" G="200" B="255" />
            <EndColor A="255" R="255" G="255" B="255" />
            <ColorVector ScaleY="1.0000" />
          </AbstractNodeData>
          <AbstractNodeData Name="Sprite_3" ActionTag="-1396215919" Tag="29" IconVisible="False" LeftMargin="-95.8579" RightMargin="-73.1421" TopMargin="-352.7534" BottomMargin="184.7534" ctype="SpriteObjectData">
            <Size X="169.0000" Y="168.0000" />
            <AnchorPoint ScaleX="0.5000" ScaleY="0.5000" />
            <Position X="-11.3579" Y="268.7534" />
            <Scale ScaleX="1.0000" ScaleY="1.0000" />
            <CColor A="255" R="255" G="255" B="255" />
            <PrePosition />
            <PreSize X="0.0000" Y="0.0000" />
            <FileData Type="Normal" Path="hero104skill01/fly04.png" Plist="" />
            <BlendFunc Src="770" Dst="771" />
          </AbstractNodeData>
          <AbstractNodeData Name="Sprite_4" Visible="False" ActionTag="-1427202678" Tag="30" IconVisible="False" LeftMargin="-23.0000" RightMargin="-23.0000" TopMargin="-23.0000" BottomMargin="-23.0000" ctype="SpriteObjectData">
            <Size X="232.0000" Y="319.0000" />
            <AnchorPoint ScaleX="0.5000" ScaleY="0.5000" />
            <Position />
            <Scale ScaleX="1.0000" ScaleY="1.0000" />
            <CColor A="255" R="255" G="255" B="255" />
            <PrePosition />
            <PreSize X="0.0000" Y="0.0000" />
            <FileData Type="Normal" Path="hero104skill01/hero02.png" Plist="" />
            <BlendFunc Src="770" Dst="771" />
          </AbstractNodeData>
        </Children>
      </ObjectData>
    </Content>
  </Content>
</GameFile>