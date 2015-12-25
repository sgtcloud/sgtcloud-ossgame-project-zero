<GameFile>
  <PropertyGroup Name="chest01" Type="Node" ID="b654d981-7e19-47f4-b5ef-15f70d720fce" Version="2.3.3.0" />
  <Content ctype="GameProjectContent">
    <Content>
      <Animation Duration="5" Speed="0.5000">
        <Timeline ActionTag="-1849589259" Property="Position">
          <PointFrame FrameIndex="0" X="0.0000" Y="0.0000">
            <EasingData Type="0" />
          </PointFrame>
          <PointFrame FrameIndex="5" X="0.0000" Y="-0.0001">
            <EasingData Type="0" />
          </PointFrame>
        </Timeline>
        <Timeline ActionTag="-1849589259" Property="FileData">
          <TextureFrame FrameIndex="0" Tween="False">
            <TextureFile Type="MarkedSubImage" Path="chest/chest01/chest01_close01.png" Plist="chest01.plist" />
          </TextureFrame>
          <TextureFrame FrameIndex="5" Tween="False">
            <TextureFile Type="MarkedSubImage" Path="chest/chest01/chest01_open01.png" Plist="chest01.plist" />
          </TextureFrame>
        </Timeline>
      </Animation>
      <AnimationList>
        <AnimationInfo Name="close" StartIndex="0" EndIndex="2">
          <RenderColor A="255" R="175" G="238" B="238" />
        </AnimationInfo>
        <AnimationInfo Name="open" StartIndex="4" EndIndex="5">
          <RenderColor A="255" R="255" G="255" B="224" />
        </AnimationInfo>
      </AnimationList>
      <ObjectData Name="Node" Tag="40" ctype="GameNodeObjectData">
        <Size X="0.0000" Y="0.0000" />
        <Children>
          <AbstractNodeData Name="chest01" ActionTag="-1849589259" Tag="45" IconVisible="False" LeftMargin="-54.5000" RightMargin="-54.5000" TopMargin="-52.5000" BottomMargin="-52.5000" ctype="SpriteObjectData">
            <Size X="109.0000" Y="105.0000" />
            <AnchorPoint ScaleX="0.5000" ScaleY="0.5000" />
            <Position />
            <Scale ScaleX="1.0000" ScaleY="1.0000" />
            <CColor A="255" R="255" G="255" B="255" />
            <PrePosition />
            <PreSize X="0.0000" Y="0.0000" />
            <FileData Type="MarkedSubImage" Path="chest/chest01/chest01_close01.png" Plist="chest01.plist" />
            <BlendFunc Src="770" Dst="771" />
          </AbstractNodeData>
        </Children>
      </ObjectData>
    </Content>
  </Content>
</GameFile>