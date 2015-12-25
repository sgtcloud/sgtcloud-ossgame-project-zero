<GameFile>
  <PropertyGroup Name="chest04" Type="Node" ID="eec0bfbe-17ec-4401-a69e-0d373d243ba8" Version="2.3.3.0" />
  <Content ctype="GameProjectContent">
    <Content>
      <Animation Duration="5" Speed="1.0000">
        <Timeline ActionTag="-1412657958" Property="Position">
          <PointFrame FrameIndex="0" X="0.0000" Y="0.0000">
            <EasingData Type="0" />
          </PointFrame>
          <PointFrame FrameIndex="5" X="0.0000" Y="0.0000">
            <EasingData Type="0" />
          </PointFrame>
        </Timeline>
        <Timeline ActionTag="-1412657958" Property="FileData">
          <TextureFrame FrameIndex="0" Tween="False">
            <TextureFile Type="MarkedSubImage" Path="chest/chest04/chest04_close01.png" Plist="chest04.plist" />
          </TextureFrame>
          <TextureFrame FrameIndex="5" Tween="False">
            <TextureFile Type="MarkedSubImage" Path="chest/chest04/chest04_open01.png" Plist="chest04.plist" />
          </TextureFrame>
        </Timeline>
      </Animation>
      <AnimationList>
        <AnimationInfo Name="close" StartIndex="0" EndIndex="2">
          <RenderColor A="150" R="205" G="133" B="63" />
        </AnimationInfo>
        <AnimationInfo Name="open" StartIndex="4" EndIndex="5">
          <RenderColor A="150" R="165" G="42" B="42" />
        </AnimationInfo>
      </AnimationList>
      <ObjectData Name="Node" Tag="43" ctype="GameNodeObjectData">
        <Size X="0.0000" Y="0.0000" />
        <Children>
          <AbstractNodeData Name="chest04" ActionTag="-1412657958" Tag="48" IconVisible="False" LeftMargin="-68.5000" RightMargin="-68.5000" TopMargin="-56.5000" BottomMargin="-56.5000" ctype="SpriteObjectData">
            <Size X="137.0000" Y="113.0000" />
            <AnchorPoint ScaleX="0.5000" ScaleY="0.5000" />
            <Position />
            <Scale ScaleX="1.0000" ScaleY="1.0000" />
            <CColor A="255" R="255" G="255" B="255" />
            <PrePosition />
            <PreSize X="0.0000" Y="0.0000" />
            <FileData Type="MarkedSubImage" Path="chest/chest04/chest04_open01.png" Plist="chest04.plist" />
            <BlendFunc Src="770" Dst="771" />
          </AbstractNodeData>
        </Children>
      </ObjectData>
    </Content>
  </Content>
</GameFile>