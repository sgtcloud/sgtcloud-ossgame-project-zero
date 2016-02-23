<GameFile>
  <PropertyGroup Name="key02" Type="Node" ID="1d979878-5f99-49ce-b6ad-9d8855c93e7c" Version="2.3.3.0" />
  <Content ctype="GameProjectContent">
    <Content>
      <Animation Duration="3" Speed="0.3333">
        <Timeline ActionTag="-2128941877" Property="Position">
          <PointFrame FrameIndex="3" X="0.0000" Y="0.0000">
            <EasingData Type="0" />
          </PointFrame>
        </Timeline>
        <Timeline ActionTag="-2128941877" Property="FileData">
          <TextureFrame FrameIndex="0" Tween="False">
            <TextureFile Type="MarkedSubImage" Path="key/key02/silver_key_shine01.png" Plist="key02.plist" />
          </TextureFrame>
          <TextureFrame FrameIndex="3" Tween="False">
            <TextureFile Type="MarkedSubImage" Path="key/key02/silver_key_shine02.png" Plist="key02.plist" />
          </TextureFrame>
        </Timeline>
      </Animation>
      <AnimationList>
        <AnimationInfo Name="shine" StartIndex="0" EndIndex="3">
          <RenderColor A="150" R="107" G="142" B="35" />
        </AnimationInfo>
      </AnimationList>
      <ObjectData Name="Node" Tag="5" ctype="GameNodeObjectData">
        <Size X="0.0000" Y="0.0000" />
        <Children>
          <AbstractNodeData Name="key" ActionTag="-2128941877" Tag="6" IconVisible="False" LeftMargin="-15.0000" RightMargin="-15.0000" TopMargin="-15.0000" BottomMargin="-15.0000" ctype="SpriteObjectData">
            <Size X="30.0000" Y="30.0000" />
            <AnchorPoint ScaleX="0.5000" ScaleY="0.5000" />
            <Position />
            <Scale ScaleX="1.0000" ScaleY="1.0000" />
            <CColor A="255" R="255" G="255" B="255" />
            <PrePosition />
            <PreSize X="0.0000" Y="0.0000" />
            <FileData Type="MarkedSubImage" Path="key/key02/silver_key_shine01.png" Plist="key02.plist" />
            <BlendFunc Src="770" Dst="771" />
          </AbstractNodeData>
        </Children>
      </ObjectData>
    </Content>
  </Content>
</GameFile>