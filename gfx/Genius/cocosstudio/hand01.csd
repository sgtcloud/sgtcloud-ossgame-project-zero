<GameFile>
  <PropertyGroup Name="hand01" Type="Node" ID="def943e5-4b91-4dea-8a15-6d6d917e49a4" Version="2.3.3.0" />
  <Content ctype="GameProjectContent">
    <Content>
      <Animation Duration="3" Speed="0.1667">
        <Timeline ActionTag="-1262535167" Property="Position">
          <PointFrame FrameIndex="0" X="0.0000" Y="10.0000">
            <EasingData Type="0" />
          </PointFrame>
          <PointFrame FrameIndex="3" X="0.0000" Y="0.0000">
            <EasingData Type="0" />
          </PointFrame>
        </Timeline>
        <Timeline ActionTag="-1262535167" Property="FileData">
          <TextureFrame FrameIndex="0" Tween="False">
            <TextureFile Type="MarkedSubImage" Path="guide/hand_point01.png" Plist="other.plist" />
          </TextureFrame>
          <TextureFrame FrameIndex="3" Tween="False">
            <TextureFile Type="MarkedSubImage" Path="guide/hand_point02.png" Plist="other.plist" />
          </TextureFrame>
        </Timeline>
        <Timeline ActionTag="-1262535167" Property="AnchorPoint">
          <ScaleFrame FrameIndex="0" X="0.5000" Y="0.0000">
            <EasingData Type="0" />
          </ScaleFrame>
        </Timeline>
      </Animation>
      <AnimationList>
        <AnimationInfo Name="point" StartIndex="0" EndIndex="3">
          <RenderColor A="150" R="128" G="128" B="128" />
        </AnimationInfo>
      </AnimationList>
      <ObjectData Name="Node" ctype="GameNodeObjectData">
        <Size X="0.0000" Y="0.0000" />
        <Children>
          <AbstractNodeData Name="hand" ActionTag="-1262535167" Tag="2" IconVisible="False" LeftMargin="-40.0000" RightMargin="-40.0000" TopMargin="-90.0000" ctype="SpriteObjectData">
            <Size X="80.0000" Y="90.0000" />
            <AnchorPoint ScaleX="0.5000" />
            <Position />
            <Scale ScaleX="1.0000" ScaleY="1.0000" />
            <CColor A="255" R="255" G="255" B="255" />
            <PrePosition />
            <PreSize X="0.0000" Y="0.0000" />
            <FileData Type="MarkedSubImage" Path="guide/hand_point02.png" Plist="other.plist" />
            <BlendFunc Src="770" Dst="771" />
          </AbstractNodeData>
        </Children>
      </ObjectData>
    </Content>
  </Content>
</GameFile>