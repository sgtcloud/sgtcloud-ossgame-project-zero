<GameFile>
  <PropertyGroup Name="chest03" Type="Node" ID="e9493d7b-bc9b-4987-85a0-086cd7fce62b" Version="2.3.3.0" />
  <Content ctype="GameProjectContent">
    <Content>
      <Animation Duration="5" Speed="0.3333">
        <Timeline ActionTag="-504332941" Property="Position">
          <PointFrame FrameIndex="0" X="0.0000" Y="0.0000">
            <EasingData Type="0" />
          </PointFrame>
          <PointFrame FrameIndex="5" X="0.0000" Y="0.0000">
            <EasingData Type="0" />
          </PointFrame>
        </Timeline>
        <Timeline ActionTag="-504332941" Property="FileData">
          <TextureFrame FrameIndex="0" Tween="False">
            <TextureFile Type="MarkedSubImage" Path="chest/chest03/chest03_close01.png" Plist="chest03.plist" />
          </TextureFrame>
          <TextureFrame FrameIndex="5" Tween="False">
            <TextureFile Type="MarkedSubImage" Path="chest/chest03/chest03_open01.png" Plist="chest03.plist" />
          </TextureFrame>
        </Timeline>
      </Animation>
      <AnimationList>
        <AnimationInfo Name="close" StartIndex="0" EndIndex="2">
          <RenderColor A="150" R="70" G="130" B="180" />
        </AnimationInfo>
        <AnimationInfo Name="open" StartIndex="4" EndIndex="5">
          <RenderColor A="150" R="30" G="144" B="255" />
        </AnimationInfo>
      </AnimationList>
      <ObjectData Name="Node" Tag="42" ctype="GameNodeObjectData">
        <Size X="0.0000" Y="0.0000" />
        <Children>
          <AbstractNodeData Name="chest03" ActionTag="-504332941" Tag="47" IconVisible="False" LeftMargin="-62.5000" RightMargin="-62.5000" TopMargin="-58.0000" BottomMargin="-58.0000" ctype="SpriteObjectData">
            <Size X="125.0000" Y="116.0000" />
            <AnchorPoint ScaleX="0.5000" ScaleY="0.5000" />
            <Position />
            <Scale ScaleX="1.0000" ScaleY="1.0000" />
            <CColor A="255" R="255" G="255" B="255" />
            <PrePosition />
            <PreSize X="0.0000" Y="0.0000" />
            <FileData Type="MarkedSubImage" Path="chest/chest03/chest03_open01.png" Plist="chest03.plist" />
            <BlendFunc Src="770" Dst="771" />
          </AbstractNodeData>
        </Children>
      </ObjectData>
    </Content>
  </Content>
</GameFile>