<GameFile>
  <PropertyGroup Name="dead" Type="Node" ID="5f119b7e-e1b6-4a33-912a-668390fc74af" Version="2.3.3.0" />
  <Content ctype="GameProjectContent">
    <Content>
      <Animation Duration="0" Speed="1.0000">
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
            <TextureFile Type="MarkedSubImage" Path="dead/dead01/dead01.png" Plist="other.plist" />
          </TextureFrame>
        </Timeline>
        <Timeline ActionTag="-226096642" Property="AnchorPoint">
          <ScaleFrame FrameIndex="0" X="0.5000" Y="0.0000">
            <EasingData Type="0" />
          </ScaleFrame>
        </Timeline>
      </Animation>
      <AnimationList>
        <AnimationInfo Name="dead" StartIndex="0" EndIndex="1">
          <RenderColor A="255" R="50" G="205" B="50" />
        </AnimationInfo>
      </AnimationList>
      <ObjectData Name="Node" Tag="5" ctype="GameNodeObjectData">
        <Size X="0.0000" Y="0.0000" />
        <Children>
          <AbstractNodeData Name="dead" ActionTag="-226096642" Tag="12" IconVisible="False" LeftMargin="-21.5000" RightMargin="-21.5000" TopMargin="-53.0000" ctype="SpriteObjectData">
            <Size X="43.0000" Y="53.0000" />
            <AnchorPoint ScaleX="0.5000" />
            <Position />
            <Scale ScaleX="0.5000" ScaleY="0.5000" />
            <CColor A="255" R="255" G="255" B="255" />
            <PrePosition />
            <PreSize X="0.0000" Y="0.0000" />
            <FileData Type="MarkedSubImage" Path="dead/dead01/dead01.png" Plist="other.plist" />
            <BlendFunc Src="770" Dst="771" />
          </AbstractNodeData>
        </Children>
      </ObjectData>
    </Content>
  </Content>
</GameFile>