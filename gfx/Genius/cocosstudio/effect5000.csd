<GameFile>
  <PropertyGroup Name="effect5000" Type="Node" ID="d5985f5d-6202-421b-a57d-afeb22f0cc29" Version="2.3.3.0" />
  <Content ctype="GameProjectContent">
    <Content>
      <Animation Duration="9" Speed="0.5000">
        <Timeline ActionTag="-1506131211" Property="Position">
          <PointFrame FrameIndex="0" X="0.0000" Y="0.0000">
            <EasingData Type="0" />
          </PointFrame>
        </Timeline>
        <Timeline ActionTag="-1506131211" Property="FileData">
          <TextureFrame FrameIndex="0" Tween="False">
            <TextureFile Type="Normal" Path="effect/effect5000/effect5000_01.png" Plist="" />
          </TextureFrame>
          <TextureFrame FrameIndex="3" Tween="False">
            <TextureFile Type="Normal" Path="effect/effect5000/effect5000_02.png" Plist="" />
          </TextureFrame>
          <TextureFrame FrameIndex="6" Tween="False">
            <TextureFile Type="Normal" Path="effect/effect5000/effect5000_03.png" Plist="" />
          </TextureFrame>
          <TextureFrame FrameIndex="9" Tween="False">
            <TextureFile Type="Normal" Path="effect/effect5000/effect5000_04.png" Plist="" />
          </TextureFrame>
        </Timeline>
      </Animation>
      <AnimationList>
        <AnimationInfo Name="boom" StartIndex="0" EndIndex="9">
          <RenderColor A="150" R="255" G="69" B="0" />
        </AnimationInfo>
      </AnimationList>
      <ObjectData Name="Node" Tag="5" ctype="GameNodeObjectData">
        <Size X="0.0000" Y="0.0000" />
        <Children>
          <AbstractNodeData Name="effect5000" ActionTag="-1506131211" Tag="9" IconVisible="False" LeftMargin="-28.0000" RightMargin="-28.0000" TopMargin="-28.5000" BottomMargin="-28.5000" ctype="SpriteObjectData">
            <Size X="56.0000" Y="57.0000" />
            <AnchorPoint ScaleX="0.5000" ScaleY="0.5000" />
            <Position />
            <Scale ScaleX="1.0000" ScaleY="1.0000" />
            <CColor A="255" R="255" G="255" B="255" />
            <PrePosition />
            <PreSize X="0.0000" Y="0.0000" />
            <FileData Type="Normal" Path="effect/effect5000/effect5000_01.png" Plist="" />
            <BlendFunc Src="770" Dst="771" />
          </AbstractNodeData>
        </Children>
      </ObjectData>
    </Content>
  </Content>
</GameFile>