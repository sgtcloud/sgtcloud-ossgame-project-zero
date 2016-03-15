<GameFile>
  <PropertyGroup Name="GuideHand" Type="Node" ID="71af9704-2f8b-4cc5-ac99-be4f32ba4061" Version="2.3.3.0" />
  <Content ctype="GameProjectContent">
    <Content>
      <Animation Duration="9" Speed="0.3333">
        <Timeline ActionTag="125515874" Property="Position">
          <PointFrame FrameIndex="3" X="0.0000" Y="15.0000">
            <EasingData Type="0" />
          </PointFrame>
          <PointFrame FrameIndex="6" X="0.0000" Y="30.0000">
            <EasingData Type="0" />
          </PointFrame>
          <PointFrame FrameIndex="9" X="0.0000" Y="15.0000">
            <EasingData Type="0" />
          </PointFrame>
        </Timeline>
        <Timeline ActionTag="125515874" Property="Scale">
          <ScaleFrame FrameIndex="0" X="1.0000" Y="0.8000">
            <EasingData Type="0" />
          </ScaleFrame>
          <ScaleFrame FrameIndex="3" X="1.0000" Y="0.9000">
            <EasingData Type="0" />
          </ScaleFrame>
          <ScaleFrame FrameIndex="6" X="1.0000" Y="1.0000">
            <EasingData Type="0" />
          </ScaleFrame>
          <ScaleFrame FrameIndex="9" X="1.0000" Y="0.9000">
            <EasingData Type="0" />
          </ScaleFrame>
        </Timeline>
        <Timeline ActionTag="125515874" Property="FileData">
          <TextureFrame FrameIndex="0" Tween="False">
            <TextureFile Type="Normal" Path="mainUI/hand.png" Plist="" />
          </TextureFrame>
          <TextureFrame FrameIndex="3" Tween="False">
            <TextureFile Type="Normal" Path="mainUI/hand.png" Plist="" />
          </TextureFrame>
          <TextureFrame FrameIndex="6" Tween="False">
            <TextureFile Type="Normal" Path="mainUI/hand.png" Plist="" />
          </TextureFrame>
          <TextureFrame FrameIndex="9" Tween="False">
            <TextureFile Type="Normal" Path="mainUI/hand.png" Plist="" />
          </TextureFrame>
        </Timeline>
      </Animation>
      <AnimationList>
        <AnimationInfo Name="point" StartIndex="0" EndIndex="9">
          <RenderColor A="150" R="135" G="206" B="235" />
        </AnimationInfo>
      </AnimationList>
      <ObjectData Name="Node" Tag="88" ctype="GameNodeObjectData">
        <Size X="0.0000" Y="0.0000" />
        <Children>
          <AbstractNodeData Name="hand" ActionTag="125515874" Tag="89" IconVisible="False" LeftMargin="-39.0000" RightMargin="-39.0000" TopMargin="-128.0000" BottomMargin="15.0000" ctype="SpriteObjectData">
            <Size X="78.0000" Y="113.0000" />
            <AnchorPoint ScaleX="0.5000" />
            <Position Y="15.0000" />
            <Scale ScaleX="1.0000" ScaleY="0.9000" />
            <CColor A="255" R="255" G="255" B="255" />
            <PrePosition />
            <PreSize X="0.0000" Y="0.0000" />
            <FileData Type="Normal" Path="mainUI/hand.png" Plist="" />
            <BlendFunc Src="770" Dst="771" />
          </AbstractNodeData>
        </Children>
      </ObjectData>
    </Content>
  </Content>
</GameFile>