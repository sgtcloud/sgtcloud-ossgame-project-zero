<GameFile>
  <PropertyGroup Name="dead" Type="Node" ID="5f119b7e-e1b6-4a33-912a-668390fc74af" Version="2.3.3.0" />
  <Content ctype="GameProjectContent">
    <Content>
      <Animation Duration="2" Speed="1.0000">
        <Timeline ActionTag="-226096642" Property="Position">
          <PointFrame FrameIndex="0" X="0.0000" Y="0.0000">
            <EasingData Type="0" />
          </PointFrame>
        </Timeline>
        <Timeline ActionTag="-226096642" Property="Scale">
          <ScaleFrame FrameIndex="0" X="0.5000" Y="0.5000">
            <EasingData Type="0" />
          </ScaleFrame>
        </Timeline>
        <Timeline ActionTag="-226096642" Property="FileData">
          <TextureFrame FrameIndex="0" Tween="False">
            <TextureFile Type="Normal" Path="dead/dead01/dead01.png" Plist="" />
          </TextureFrame>
          <TextureFrame FrameIndex="2" Tween="False">
            <TextureFile Type="Normal" Path="dead/dead01/dead02.png" Plist="" />
          </TextureFrame>
        </Timeline>
        <Timeline ActionTag="-226096642" Property="AnchorPoint">
          <ScaleFrame FrameIndex="0" X="0.5000" Y="0.0000">
            <EasingData Type="0" />
          </ScaleFrame>
        </Timeline>
      </Animation>
      <AnimationList>
        <AnimationInfo Name="dead" StartIndex="0" EndIndex="2">
          <RenderColor A="150" R="50" G="205" B="50" />
        </AnimationInfo>
      </AnimationList>
      <ObjectData Name="Node" Tag="5" ctype="GameNodeObjectData">
        <Size X="0.0000" Y="0.0000" />
        <Children>
          <AbstractNodeData Name="dead" ActionTag="-226096642" Tag="12" IconVisible="False" LeftMargin="-82.0000" RightMargin="-82.0000" TopMargin="-131.0000" ctype="SpriteObjectData">
            <Size X="164.0000" Y="131.0000" />
            <AnchorPoint ScaleX="0.5000" />
            <Position />
            <Scale ScaleX="0.5000" ScaleY="0.5000" />
            <CColor A="255" R="255" G="255" B="255" />
            <PrePosition />
            <PreSize X="0.0000" Y="0.0000" />
            <FileData Type="Normal" Path="dead/dead01/dead01.png" Plist="" />
            <BlendFunc Src="770" Dst="771" />
          </AbstractNodeData>
        </Children>
      </ObjectData>
    </Content>
  </Content>
</GameFile>