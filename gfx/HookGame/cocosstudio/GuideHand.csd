<GameFile>
  <PropertyGroup Name="GuideHand" Type="Node" ID="71af9704-2f8b-4cc5-ac99-be4f32ba4061" Version="2.3.3.0" />
  <Content ctype="GameProjectContent">
    <Content>
      <Animation Duration="9" Speed="0.3333">
        <Timeline ActionTag="125515874" Property="Position">
          <PointFrame FrameIndex="0" X="-4.5135" Y="4.8444">
            <EasingData Type="0" />
          </PointFrame>
          <PointFrame FrameIndex="3" X="9.0286" Y="-6.4385">
            <EasingData Type="0" />
          </PointFrame>
          <PointFrame FrameIndex="6" X="19.1842" Y="-16.2632">
            <EasingData Type="0" />
          </PointFrame>
          <PointFrame FrameIndex="9" X="6.7712" Y="-5.3113">
            <EasingData Type="0" />
          </PointFrame>
        </Timeline>
        <Timeline ActionTag="125515874" Property="Scale">
          <ScaleFrame FrameIndex="0" X="1.0000" Y="1.0000">
            <EasingData Type="0" />
          </ScaleFrame>
          <ScaleFrame FrameIndex="3" X="1.0000" Y="1.0000">
            <EasingData Type="0" />
          </ScaleFrame>
          <ScaleFrame FrameIndex="6" X="1.0000" Y="1.0000">
            <EasingData Type="0" />
          </ScaleFrame>
          <ScaleFrame FrameIndex="9" X="1.0000" Y="1.0000">
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
        <Timeline ActionTag="-2010624981" Property="Position">
          <PointFrame FrameIndex="0" X="73.1453" Y="-0.6308">
            <EasingData Type="0" />
          </PointFrame>
          <PointFrame FrameIndex="3" X="84.4956" Y="-16.3952">
            <EasingData Type="0" />
          </PointFrame>
          <PointFrame FrameIndex="6" X="94.5847" Y="-23.9622">
            <EasingData Type="0" />
          </PointFrame>
          <PointFrame FrameIndex="9" X="80.7118" Y="-15.1341">
            <EasingData Type="0" />
          </PointFrame>
        </Timeline>
        <Timeline ActionTag="-2010624981" Property="FileData">
          <TextureFrame FrameIndex="0" Tween="False">
            <TextureFile Type="Normal" Path="mainUI/touch.png" Plist="" />
          </TextureFrame>
          <TextureFrame FrameIndex="3" Tween="False">
            <TextureFile Type="Normal" Path="mainUI/touch.png" Plist="" />
          </TextureFrame>
          <TextureFrame FrameIndex="6" Tween="False">
            <TextureFile Type="Normal" Path="mainUI/touch.png" Plist="" />
          </TextureFrame>
          <TextureFrame FrameIndex="9" Tween="False">
            <TextureFile Type="Normal" Path="mainUI/touch.png" Plist="" />
          </TextureFrame>
        </Timeline>
      </Animation>
      <AnimationList>
        <AnimationInfo Name="point" StartIndex="0" EndIndex="9">
          <RenderColor A="255" R="135" G="206" B="235" />
        </AnimationInfo>
      </AnimationList>
      <ObjectData Name="Node" Tag="88" ctype="GameNodeObjectData">
        <Size X="0.0000" Y="0.0000" />
        <Children>
          <AbstractNodeData Name="hand" ActionTag="125515874" Tag="89" IconVisible="False" LeftMargin="6.7712" RightMargin="-117.7712" TopMargin="5.3113" BottomMargin="-106.3113" ctype="SpriteObjectData">
            <Size X="111.0000" Y="101.0000" />
            <AnchorPoint ScaleY="1.0000" />
            <Position X="6.7712" Y="-5.3113" />
            <Scale ScaleX="1.0000" ScaleY="1.0000" />
            <CColor A="255" R="255" G="255" B="255" />
            <PrePosition />
            <PreSize X="0.0000" Y="0.0000" />
            <FileData Type="Normal" Path="mainUI/hand.png" Plist="" />
            <BlendFunc Src="770" Dst="771" />
          </AbstractNodeData>
          <AbstractNodeData Name="touch" ActionTag="-2010624981" Tag="544" IconVisible="False" LeftMargin="50.2118" RightMargin="-111.2118" TopMargin="-0.3659" BottomMargin="-30.6341" ctype="SpriteObjectData">
            <Size X="61.0000" Y="31.0000" />
            <AnchorPoint ScaleX="0.5000" ScaleY="0.5000" />
            <Position X="80.7118" Y="-15.1341" />
            <Scale ScaleX="1.0000" ScaleY="1.0000" />
            <CColor A="255" R="255" G="255" B="255" />
            <PrePosition />
            <PreSize X="0.0000" Y="0.0000" />
            <FileData Type="Normal" Path="mainUI/touch.png" Plist="" />
            <BlendFunc Src="770" Dst="771" />
          </AbstractNodeData>
        </Children>
      </ObjectData>
    </Content>
  </Content>
</GameFile>