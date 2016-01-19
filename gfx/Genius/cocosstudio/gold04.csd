<GameFile>
  <PropertyGroup Name="gold04" Type="Node" ID="8538a524-4bce-486c-8cb2-b104971835d4" Version="2.3.3.0" />
  <Content ctype="GameProjectContent">
    <Content>
      <Animation Duration="3" Speed="0.3333">
        <Timeline ActionTag="-199724179" Property="Position">
          <PointFrame FrameIndex="0" X="0.0000" Y="0.0000">
            <EasingData Type="0" />
          </PointFrame>
          <PointFrame FrameIndex="3" X="0.0000" Y="0.0000">
            <EasingData Type="0" />
          </PointFrame>
        </Timeline>
        <Timeline ActionTag="-199724179" Property="FileData">
          <TextureFrame FrameIndex="0" Tween="False">
            <TextureFile Type="MarkedSubImage" Path="gold/gold04/gold04_shine01.png" Plist="gold04.plist" />
          </TextureFrame>
          <TextureFrame FrameIndex="3" Tween="False">
            <TextureFile Type="MarkedSubImage" Path="gold/gold04/gold04_shine02.png" Plist="gold04.plist" />
          </TextureFrame>
        </Timeline>
      </Animation>
      <AnimationList>
        <AnimationInfo Name="shine" StartIndex="0" EndIndex="3">
          <RenderColor A="255" R="64" G="224" B="208" />
        </AnimationInfo>
      </AnimationList>
      <ObjectData Name="Node" Tag="17" ctype="GameNodeObjectData">
        <Size X="0.0000" Y="0.0000" />
        <Children>
          <AbstractNodeData Name="gold04" ActionTag="-199724179" Tag="24" IconVisible="False" LeftMargin="-37.0000" RightMargin="-37.0000" TopMargin="-37.0000" BottomMargin="-37.0000" ctype="SpriteObjectData">
            <Size X="74.0000" Y="74.0000" />
            <AnchorPoint ScaleX="0.5000" ScaleY="0.5000" />
            <Position />
            <Scale ScaleX="1.0000" ScaleY="1.0000" />
            <CColor A="255" R="255" G="255" B="255" />
            <PrePosition />
            <PreSize X="0.0000" Y="0.0000" />
            <FileData Type="MarkedSubImage" Path="gold/gold04/gold04_shine01.png" Plist="gold04.plist" />
            <BlendFunc Src="770" Dst="771" />
          </AbstractNodeData>
        </Children>
      </ObjectData>
    </Content>
  </Content>
</GameFile>