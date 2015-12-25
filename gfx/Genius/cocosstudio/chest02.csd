<GameFile>
  <PropertyGroup Name="chest02" Type="Node" ID="ad1098f6-d4bb-4f66-8fbb-818efe5ceea8" Version="2.3.3.0" />
  <Content ctype="GameProjectContent">
    <Content>
      <Animation Duration="5" Speed="0.5000">
        <Timeline ActionTag="1148511166" Property="Position">
          <PointFrame FrameIndex="0" X="0.0000" Y="0.0000">
            <EasingData Type="0" />
          </PointFrame>
          <PointFrame FrameIndex="5" X="0.0000" Y="0.0000">
            <EasingData Type="0" />
          </PointFrame>
        </Timeline>
        <Timeline ActionTag="1148511166" Property="FileData">
          <TextureFrame FrameIndex="0" Tween="False">
            <TextureFile Type="MarkedSubImage" Path="chest/chest02/chest02_close01.png" Plist="chest02.plist" />
          </TextureFrame>
          <TextureFrame FrameIndex="5" Tween="False">
            <TextureFile Type="MarkedSubImage" Path="chest/chest02/chest02_open01.png" Plist="chest02.plist" />
          </TextureFrame>
        </Timeline>
      </Animation>
      <AnimationList>
        <AnimationInfo Name="close" StartIndex="0" EndIndex="2">
          <RenderColor A="255" R="0" G="139" B="139" />
        </AnimationInfo>
        <AnimationInfo Name="animation1" StartIndex="4" EndIndex="5">
          <RenderColor A="255" R="255" G="222" B="173" />
        </AnimationInfo>
      </AnimationList>
      <ObjectData Name="Node" Tag="41" ctype="GameNodeObjectData">
        <Size X="0.0000" Y="0.0000" />
        <Children>
          <AbstractNodeData Name="chest02" ActionTag="1148511166" Tag="46" IconVisible="False" LeftMargin="-56.0000" RightMargin="-56.0000" TopMargin="-52.5000" BottomMargin="-52.5000" ctype="SpriteObjectData">
            <Size X="112.0000" Y="105.0000" />
            <AnchorPoint ScaleX="0.5000" ScaleY="0.5000" />
            <Position />
            <Scale ScaleX="1.0000" ScaleY="1.0000" />
            <CColor A="255" R="255" G="255" B="255" />
            <PrePosition />
            <PreSize X="0.0000" Y="0.0000" />
            <FileData Type="MarkedSubImage" Path="chest/chest02/chest02_close01.png" Plist="chest02.plist" />
            <BlendFunc Src="770" Dst="771" />
          </AbstractNodeData>
        </Children>
      </ObjectData>
    </Content>
  </Content>
</GameFile>